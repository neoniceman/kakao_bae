<template>
  <div class="score-board">
    <div>
      남은시간 <span>{{ state.currentSecond }}</span> 초
    </div>
    <div>
      <span>{{ state.point }}</span> 점
    </div>
  </div>
  <div class="stage" :style="style">
    <hole
      v-for="n in state.moleArray"
      :isUp="n.isUp"
      :key="n.id"
      :id="n.id"
      @moleClick="onMoleClick"
    ></hole>
  </div>
  <div>
    <my-button
      primary="true"
      :label="state.pause ? '재개하기' : '일시정지'"
      @click="onClickPause"
    />
    <my-button primary="true" label="그만하기" @click="onClickStop" />
  </div>
</template>
<style scoped>
button + button {
  margin-left: 10px;
}

.stage {
  margin: 0 auto;
  margin-bottom: 20px;
}

.score-board {
  width: 400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
}
</style>
<script lang="ts">
import { defineComponent, reactive, computed, onMounted } from "vue";
import { useStore } from "vuex";
import router from "../router";
import MyButton from "../stories/Button.vue";
import Hole from "../stories/Hole.vue";

export default defineComponent({
  name: "Stage",
  props: {},
  components: {
    MyButton,
    Hole,
  },
  setup(props, { emit }) {
    const store = useStore();
    const state = reactive({
      colNumber: 0,
      rowNumber: 0,
      moleNumber: 0,
      width: "",
      height: "",
      point: 0,
      interval: 1000,
      maxSecond: 60,
      currentSecond: 0,
      moleArray: [] as IMole[],
      pause: false,
      level: 0,
    });

    const levelArr: Array<ILevel> = [];
    let selectLevel: ILevel;

    for (let i = 0; i < 3; i++) {
      const level1 = {} as ILevel;
      level1.timeWaitMin = 1500 - i * 500;
      level1.timeWaitMax = 2500 - i * 500;
      levelArr.push(level1);
    }

    state.colNumber = store.state.colNumber;
    state.rowNumber = store.state.rowNumber;
    state.moleNumber = store.state.moleNumber;
    state.level = store.state.level;

    selectLevel = levelArr[state.level];

    for (let i = 0; i < state.colNumber * state.rowNumber; i++) {
      const mole = {} as IMole;
      mole.id = i;
      mole.isUp = false;
      mole.ready = false;
      state.moleArray.push(mole);
    }

    // 10초마다 속도를 빠르게 처리
    const speedUp = () => {
      if (state.pause == false) {
        const timerSpeed: ReturnType<typeof setTimeout> = setTimeout(() => {
          selectLevel.timeWaitMin = selectLevel.timeWaitMin - 50;
          selectLevel.timeWaitMax = selectLevel.timeWaitMax - 50;
        }, 10000);
      }
    };

    speedUp();

    const update = () => {
      if (state.currentSecond == state.maxSecond) {
        return;
      } else {
        const time = randomInt(500, 1000);
        const timeWait = randomInt(
          selectLevel.timeWaitMin,
          selectLevel.timeWaitMax
        );

        // 이미 튀어 나온갯수가 최대값을 넘었는지 확인한다.
        const upTarget = state.moleArray.filter((item: IMole) => {
          if (item.ready == true) {
            return true;
          }
        });

        if (upTarget.length < state.moleNumber) {
          const target = state.moleArray.filter((item: IMole) => {
            if (item.ready == false) {
              return true;
            }
          });

          let idx = -1;
          let selectedMole: IMole = {} as IMole;
          if (target.length > 0) {
            idx = Math.floor(Math.random() * target.length);

            selectedMole = target[idx];
            selectedMole.ready = true;
          }

          if (idx > -1) {
            let showCallback = () => {
              selectedMole.isUp = true;

              let hideCallback = () => {
                if (selectedMole.isUp) {
                  selectedMole.isUp = false;
                  selectedMole.ready = false;
                }
              };

              const timerHide: ReturnType<typeof setTimeout> = setTimeout(
                hideCallback,
                timeWait
              );

              let t2 = {} as ITimer;
              t2.startDate = new Date();
              t2.timerId = timerHide;
              t2.callBack = hideCallback;
              selectedMole.hideTimer = t2;
            };
            const timerShow: ReturnType<typeof setTimeout> = setTimeout(
              showCallback,
              time
            );

            let t1 = {} as ITimer;
            t1.startDate = new Date();
            t1.timerId = timerShow;
            t1.callBack = showCallback;
            selectedMole.showTimer = t1;
          }
        }

        const timerUpdate: ReturnType<typeof setTimeout> = setTimeout(() => {
          if (state.pause) {
            return;
          }
          update();
        }, 500);
      }
    };

    const timeUpdate = () => {
      if (state.currentSecond == state.maxSecond) {
        state.pause = true;
        // console.log("시간 달성");

        router.push({
          name: "Finish",
          params: { point: state.point },
        });
      }

      const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
        if (state.pause) {
          return;
        }

        // console.log("시간업데이트");
        state.currentSecond++;
        timeUpdate();
      }, 1000);
    };

    const randomInt = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // 두더지 상자 전체 크기 설정
    state.width = 200 * state.colNumber + "px";
    state.height = 200 * state.rowNumber + "px";

    const onMoleClick = (e: IMole) => {
      if (!state.pause) {
        state.point++;
        state.moleArray[e.id].isUp = false;
        state.moleArray[e.id].ready = false;
      }
    };

    // 모든 동장 그만
    const onClickPause = () => {
      state.pause = !state.pause;
      if (!state.pause) {
        timeUpdate();
        update();
      }

      const upTarget = state.moleArray.filter((item: IMole) => {
        if (item.ready == true) {
          return true;
        }
      });

      if (state.pause == true) {
        for (let i = 0; i < upTarget.length; i++) {
          let item = upTarget[i];

          if (item.showTimer.timerId) {
            clearTimeout(item.showTimer.timerId);
          }

          if (item.hideTimer.timerId) {
            clearTimeout(item.hideTimer.timerId);
          }
          item.showTimer.pauseDate = new Date();
          item.hideTimer.pauseDate = new Date();
        }
      } else {
        for (let i = 0; i < upTarget.length; i++) {
          let item = upTarget[i];

          // 아직 올라가지 않은 애들만 포함시킨다.
          if (item.isUp == false && item.showTimer.timerId) {
            let delay = +item.showTimer.pauseDate - +item.showTimer.startDate;

            const timerShow: ReturnType<typeof setTimeout> = setTimeout(
              item.showTimer.callBack,
              delay
            );
          }

          // 아직 내려가지 않은 애들만 포함시긴다.
          if (item.isUp == true && item.hideTimer.timerId) {
            let delay = +item.hideTimer.pauseDate - +item.hideTimer.startDate;

            const timerHide: ReturnType<typeof setTimeout> = setTimeout(
              item.hideTimer.callBack,
              delay
            );
          }
        }
      }
    };

    // 하던 동작을 멈추고 홈으로
    const onClickStop = () => {
      state.pause = true;
      router.push("/");
    };

    onMounted(() => {
      timeUpdate();
      update();
    });

    return {
      state,
      style: computed(() => ({
        width: state.width,
        height: state.height,
      })),
      onClickPause,
      onClickStop,
      onMoleClick,
    };
  },
});

export interface IMole {
  id: number; //  고유 인덱스값
  isUp: boolean; // 튀어나왔는지 여부
  ready: boolean; // 튀어 나올준비가 되었는지 여부
  showTimer: ITimer;
  hideTimer: ITimer;
}

export interface ILevel {
  timeWaitMin: number;
  timeWaitMax: number;
}

// TODO : ts 에서 타이머 커스터 모듈로 작성필요
export interface ITimer {
  timerId: number;
  startDate: Date;
  pauseDate: Date;
  callBack: any;
}
</script>

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
      moleArray: [] as Mole[],
      pause: false,
      level: 0,
    });

    const levelArr: Array<Level> = [];
    let selectLevel: Level;

    for (var i = 0; i < 3; i++) {
      const level1 = {} as Level;
      level1.timeWaitMin = 1500 - i * 500;
      level1.timeWaitMax = 2500 - i * 500;
      levelArr.push(level1);
    }


    state.colNumber = store.state.colNumber;
    state.rowNumber = store.state.rowNumber;
    state.moleNumber = store.state.moleNumber;
    state.level = store.state.level;

    selectLevel = levelArr[state.level];

    for (i = 0; i < state.colNumber * state.rowNumber; i++) {
      const mole = {} as Mole;
      mole.id = i;
      mole.isUp = false;
      mole.ready = false;
      state.moleArray.push(mole);
    }

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
        const upTarget = state.moleArray.filter((item: Mole) => {
          if (item.ready == true) {
            return true;
          }
        });

        if (upTarget.length < state.moleNumber) {
          const target = state.moleArray.filter((item: Mole) => {
            if (item.ready == false) {
              return true;
            }
          });

          let idx = -1;
          let selectedItem: Mole;
          if (target.length > 0) {
            idx = Math.floor(Math.random() * target.length);

            selectedItem = target[idx];
            selectedItem.ready = true;
          }

          const timerShow: ReturnType<typeof setTimeout> = setTimeout(() => {
            if (idx > -1) {
              selectedItem.isUp = true;

              const timerHide: ReturnType<typeof setTimeout> = setTimeout(
                () => {
                  if (selectedItem.isUp) {
                    selectedItem.isUp = false;
                    selectedItem.ready = false;
                  }
                },
                timeWait
              );

              let t2 = {} as Timer;
              t2.StartTime = new Date();
              t2.timerId = timerHide;
            }
          }, time);
          let t1 = {} as Timer;
          t1.StartTime = new Date();
          t1.timerId = timerShow;
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
        console.log("시간 달성");

        router.push({
          name: "Finish",
          params: { point: state.point },
        });
      }

      const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
        if (state.pause) {
          return;
        }

        console.log("시간업데이트");
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

    const onMoleClick = (e: Mole) => {
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
      getCheckUp: computed((index: number) => {
        // 이거 안되네;
        return state.moleArray[index].isUp;
      }),
    };
  },
});

export interface Mole {
  id: number; //  고유 인덱스값
  isUp: boolean; // 튀어나왔는지 여부
  ready: boolean; // 튀어 나올준비가 되었는지 여부
}

export interface Level {
  timeWaitMin: number;
  timeWaitMax: number;
}

export interface Timer {
  timerId: number;
  StartTime: Date;
}
</script>

<template>
  <div class="group-box">
    <input-area
      label="열"
      placeholder="열수"
      max="6"
      min="2"
      maxlength="1"
      :value="state.colNumber.val"
      :name="state.colNumber.name"
      :validMessage="state.colNumber.validMessage"
      :validShow="state.colNumber.validShow"
      @callParents="colNumberChange"
    />

    <input-area
      label="행"
      placeholder="행수"
      max="6"
      min="2"
      maxlength="1"
      :value="state.rowNumber.val"
      :name="state.rowNumber.name"
      :validMessage="state.rowNumber.validMessage"
      :validShow="state.rowNumber.validShow"
      @callParents="rowNumberChange"
    />

    <input-area
      label="두더지"
      placeholder="두더지 수"
      :max="state.maxMoleCount"
      min="1"
      :maxlength="state.maxMoleLength"
      :value="state.moleNumber.val"
      :name="state.moleNumber.name"
      :validMessage="state.moleNumber.validMessage"
      :validShow="state.moleNumber.validShow"
      @callParents="moleNumberChange"
    />
    <my-button primary="true" label="시작" @click="onClick" />
  </div>
</template>
<style scoped>
.group-box {
  width: 270px;
  display: inline-block;
  text-align: right;
}
</style>
<script lang="ts">
import { defineComponent, reactive, computed, onMounted } from "vue";
import { useStore } from "vuex";
import router from "../router";
import InputArea from "../stories/InputArea.vue";
import MyButton from "../stories/Button.vue";

export default defineComponent({
  name: "Home",
  components: {
    InputArea,
    MyButton,
  },
  setup(props, { emit }) {
    const store = useStore();

    const state = reactive({
      colNumber: {
        name: "colNumber",
        val: 2,
        validMessage: "2부터 6까지 입력 가능합니다.",
        validShow: false,
      },
      rowNumber: {
        name: "rowNumber",
        val: 2,
        validMessage: "2부터 6까지 입력 가능합니다.",
        validShow: false,
      },
      moleNumber: {
        name: "moleNumber",
        val: 2,
        validMessage: "입력해 주세요.",
        validShow: false,
      },
      maxMoleCount: 2,
      maxMoleLength: 1,
    });

    const colNumberChange = (e: any) => {
      state.colNumber.val = e.val;
      state.colNumber.validShow = e.validShow;
      calculation();
    };

    const rowNumberChange = (e: any) => {
      state.rowNumber.val = e.val;
      state.rowNumber.validShow = e.validShow;
      calculation();
    };

    const moleNumberChange = (e: any) => {
      state.moleNumber.val = e.val;
      state.moleNumber.validShow = e.validShow;
    };

    const calculation = () => {
      // 열과 행 모두 입력되었을때, 두더지 입력값 설정
      if (state.colNumber.val && state.rowNumber.val) {
        var v = state.colNumber.val * state.rowNumber.val;
        state.maxMoleCount = Math.round(v / 2) - 1;
        state.maxMoleLength = state.maxMoleCount.toString().length;
      }

      // 두더지 입력값이, 행과 열에 의해 계산된 값보다 클경우 계산된 값으로 입력값 대체
      if (state.moleNumber.val) {
        if (state.moleNumber.val > state.maxMoleCount) {
          state.moleNumber.val = state.maxMoleCount;
        }
      }
    };

    onMounted(() => {
      // 스토어에 값이 있는지 체크한다.
      if (store.state.colNumber > 0) {
        state.colNumber.val = store.state.colNumber;
        state.rowNumber.val = store.state.rowNumber;
        state.moleNumber.val = store.state.moleNumber;
      }
    });

    return {
      state,
      colNumberChange,
      rowNumberChange,
      moleNumberChange,
      onClick(e: any) {
        state.colNumber.validShow = !state.colNumber.val;
        state.rowNumber.validShow = !state.rowNumber.val;
        state.moleNumber.validShow = !state.moleNumber.val;

        // 입력값 체크가 모두 끝났을때 화면 그리고 처리 적용
        if (
          !state.colNumber.validShow &&
          !state.rowNumber.validShow &&
          !state.moleNumber.validShow
        ) {
          const params = {
            colNumber: state.colNumber.val,
            rowNumber: state.rowNumber.val,
            moleNumber: state.moleNumber.val,
          };

          // 네비게이션 전달 확인용
          store.commit("update", params);
          router.push({
            name: "Stage"
          });
        }
      },
    };
  },
});
</script>

<template>
  <div class="stage">
    <h1>This is an stage page</h1>
  </div>
  <my-button primary="true" label="잠시멈춤" @click="onClickPause" />
  <my-button primary="true" label="그만하기" @click="onClickStop" />
</template>
<style scoped>
button + button {
  margin-left: 10px;
}
</style>
<script lang="ts">
import { defineComponent, reactive, computed, onMounted } from "vue";
import MyButton from "../stories/Button.vue";
import router from "../router";

export default defineComponent({
  name: "Stage",
  props: {
    colNumber: {
      type: Number,
      required: true,
    },
    rowNumber: {
      type: Number,
      required: true,
    },
    moleNumber: {
      type: Number,
      required: true,
    },
  },
  components: {
    MyButton,
  },
  setup(props, { emit }) {
    onMounted(() => {
      console.log("화면진입", props);
    });

    return {
      onClickPause(e: any) {
        // 모든 동장 그만
        console.log("aaa");
      },
      onClickStop(e: any) {
        // 하던 동작을 멈추고 홈으로
        router.push("/");
      },
    };
  },
});
</script>
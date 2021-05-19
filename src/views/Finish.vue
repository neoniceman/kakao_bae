<template>
  <div>
    <div>최종 점수</div>
    <div class="score-box">
      <span>{{ point }}</span> 점
    </div>
  </div>
  <my-button primary="true" label="다시하기" @click="onClickRestart" />
  <my-button primary="true" label="처음으로" @click="onClickHome" />
</template>
<style scoped>
button + button {
  margin-left: 10px;
}

.score-box {
  margin: 20px 0;
}
</style>
<script lang="ts">
import { defineComponent, reactive, computed, onMounted } from "vue";
import MyButton from "../stories/Button.vue";
import router from "../router";

export default defineComponent({
  name: "Finish",
  props: {
    point: {
      type: Number,
      required: true,
    },
  },
  components: {
    MyButton,
  },
  setup(props, { emit }) {
    return {
      onClickRestart(e: any) {
        router.push("Stage");
      },
      onClickHome(e: any) {
        router.push("/");
      },
    };
  },
});
</script>

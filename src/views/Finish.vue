<template>
  <div class="stage">
    <h1>This is an stage page</h1>
  </div>
  <my-button primary="true" label="다시하기" @click="onClickRestart" />
  <my-button primary="true" label="처음으로" @click="onClickHome" />
</template>
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
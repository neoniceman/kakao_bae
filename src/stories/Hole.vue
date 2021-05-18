<template>
  <div class="hole" :class="{ up : isUp }">
      <div class="mole" @click="moleClick"></div>
  </div>
</template>

<style scoped>
@import "./Hole.css";
</style>

<script lang="ts">
import { defineComponent, reactive, computed } from "vue";
import MyButton from "../stories/Button.vue";

export default defineComponent({
  name: "Hole",
  props: {
      isUp: {
          type: Boolean,
          required: true,
      }
  },
  emits: ["moleClick"],
  setup(props, { emit }) {
    props = reactive(props);
    const state = reactive({

    });

    return {
      state,
      moleClick() {
          emit('moleClick');
      }    
    };
  },
});
</script>

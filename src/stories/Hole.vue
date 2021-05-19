<template>
  <div class="hole" :class="classes">
    <div class="mole" @click="onMoleClick"></div>
  </div>
</template>

<style scoped>
@import "./Hole.css";
</style>

<script lang="ts">
import { defineComponent, reactive, computed } from "vue";

export default defineComponent({
  name: "Hole",
  props: {
    isUp: {
      type: Boolean,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
  },
  emits: ["mole-click"],
  setup(props, { emit }) {
    props = reactive(props);
    const state = reactive({
      isUp: props.isUp,
    });
    const onMoleClick = () => {
      emit("mole-click", props);
    };

    return {
      state,
      onMoleClick,
      classes: computed(() => ({
        up: props.isUp,
      })),
    };
  },
});
</script>

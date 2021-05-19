<template>
  <div class="area-box">
    <label>{{ label }}</label> :
    <input
      type="number"
      :placeholder="placeholder"
      :min="min"
      :max="max"
      :maxlength="maxlength"
      :value="value"
      :name="name"
      @input="typing"
    />
  </div>
  <div class="valid" v-show="validShow">{{ validMessage }}</div>
</template>

<style scoped>
@import "./InputArea.css";
</style>

<script lang="ts">
import { defineComponent, reactive, computed } from "vue";

export default defineComponent({
  name: "input-area",
  props: {
    label: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    min: {
      type: Number,
      required: true,
    },
    maxlength: {
      type: Number,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    validMessage: {
      type: String,
      required: true,
    },
    validShow: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["call-parents"],
  setup(props, { emit }) {
    props = reactive(props);
    const state = reactive({
      validShow: props.validShow,
    });

    return {
      state,
      typing(e: any) {
        if (e.target.value.length > e.target.maxLength) {
          e.target.value = e.target.value.slice(0, e.target.maxLength);
          state.validShow = false;
        }

        if (e.target.value) {
          if (e.target.value > e.target.max) {
            e.target.value = e.target.max;
            state.validShow = false;
          }

          if (e.target.value < e.target.min) {
            e.target.value = e.target.min;
            state.validShow = false;
          }
        }

        state.validShow = false;
        emit("call-parents", {
          val: e.target.value,
          name: e.target.name,
          validShow: state.validShow,
        });
      },
    };
  },
});
</script>

<template>
  <div class="description">
    <div class="label">{{ label }}:</div>
    <div class="value">{{ value }}</div>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs } from "vue";
export default {
  name: "Description",
  props: ["label", "value"],
  setup(props) {
    const state = reactive({});
    const funMethods = {};
    const requestMethods = {};

    return {
      ...props,
      ...toRefs(state),
      ...funMethods,
      ...requestMethods,
    };
  },
};
</script>

<style lang="scss" scoped>
.description {
  display: flex;
  flex-direction: row;
  margin-top: 12px;
  .label{
    width: 200px;
    display: flex;
    justify-content: flex-end;
    margin-right: 16px;
    // margin-left: 80px;
    // border: 1px solid #02294b;
    padding: 8px;
  }
  .value{
    width: 200px;
    color: #fff;
    border: 1px solid #02294b;
    padding: 8px;
  }
}
</style>

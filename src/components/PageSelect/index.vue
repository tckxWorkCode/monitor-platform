<template>
  <div class="page-select">
    共{{ total }}条
    <div class="item"><</div>
    <div class="item">{{ page }}</div>
    <div class="item">></div>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs } from "vue";
export default {
  name: "PageSelect",
  setup() {
    const state = reactive({
        page:1,
        total:0,
    });
    const funMethods = {};
    const requestMethods = {};

    return {
      ...toRefs(state),
      ...funMethods,
      ...requestMethods,
    };
  },
};
</script>

<style lang="scss" scoped>
.page-select{
    display: flex;
    flex-direction: row;
    justify-content: right;
    align-items: center;
    color: #fff;
    .item{
        min-height: 32px;
        min-width: 32px;
        border: 1px solid #194755;
        color: #fff;
        font-size: 14px;
        text-align: center;
        line-height: 32px;
        border-radius: 10px;
        margin-left: 10px;
    }
}
</style>

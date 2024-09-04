<template>
  <div class="detect-warn">
    <Header></Header>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs } from "vue";
import Header from "./components/Header.vue";
import Content from "./components/Content.vue";

export default {
  name: "DetectWarn",
  components: { Header,Content },
  setup() {
    const state = reactive({});
    const funMethods = {};
    const requestMethods = {
      getListFun() {},
    };

    return {
      ...toRefs(state),
      ...funMethods,
      ...requestMethods,
    };
  },
};
</script>

<style lang="scss" scoped>
.detect-warn {
  height: calc(100vh - 100px);
  width: 100%;
  background-image: url("../../assets/bigScreen/menu/backImg.png");
  // background-color: #021438;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  color: #fff;
  overflow-y: hidden;
}
</style>

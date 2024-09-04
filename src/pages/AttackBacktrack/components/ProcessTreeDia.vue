<template>
  <div>
    <el-dialog>
        
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs } from "vue";
export default {
  name: "ProcessTreeDia",
  setup() {
    const state = reactive({});
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

<style lang="scss" scoped></style>

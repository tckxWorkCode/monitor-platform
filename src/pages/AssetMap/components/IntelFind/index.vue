<template>
  <div>
    <div class="btnsStyle">
      <el-button type="primary" @click="addTaskFun">新增</el-button>
      <el-button type="primary">删除</el-button>
    </div>
    <TableWapper :colConfigs="colConfigs" :tableData="tableData" />
  </div>
  <AddTask ref="taskRef" />
</template>

<script lang="ts">
import { reactive, toRefs } from "vue";
import TableWapper from "@/components/Table/index.vue";
import AddTask from "../AddTask.vue";
export default {
  name: "IntelFind",
  components: { TableWapper, AddTask },
  setup() {
    const state = reactive({
      taskRef: null,
      tableData: [],
      colConfigs: [
        { slot: "selection" },
        { slot: "index" },
        { label: "任务名称", prop: "" },
        { label: "资产核查IP", prop: "" },
        { label: "归属省份", prop: "" },
        { label: "开始时间", prop: "" },
        { label: "结束时间", prop: "" },
        { label: "执行类型", prop: "" },
        { label: "进度", prop: "" },
        { label: "状态", prop: "" },
        { slot: "option" },
      ],
    });
    const funMethods = {
      addTaskFun() {
        state.taskRef.show();
      },
    };
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
.btnsStyle {
  margin-bottom: 20px;
  margin-left: 20px;
}
</style>

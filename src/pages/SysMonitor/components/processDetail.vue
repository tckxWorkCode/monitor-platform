<template>
  <div class="row-content">
    <!-- <div v-if="showNoData" class="noData"><img :src="require('@/assets/nodata.png')"/></div> -->
    <div>
      <el-card class="top">
        <el-descriptions title="基础信息" :column="2">
          <el-descriptions-item label="进程名 : ">{{ rowInfo?.proc_name }}</el-descriptions-item>
          <el-descriptions-item label="上报时间 : ">{{ rowInfo?.record_time }}</el-descriptions-item>
          <el-descriptions-item label="所属用户 : ">{{ rowInfo?.user }}</el-descriptions-item>
          <el-descriptions-item label="命令行参数 : ">{{ rowInfo?.proc_args }}</el-descriptions-item>
          <el-descriptions-item label="路径 : ">{{ rowInfo?.proc_path }}</el-descriptions-item>
          <el-descriptions-item label=""></el-descriptions-item>
          <el-descriptions-item label="异常函数:">
            <div class="funs-style">
              <div v-for="m in rowInfo?.list">
                <el-button
                  type="primary"
                  style="margin-right: 10px"
                  @click="logicName = m.assemb"
                  >{{ m.funcname?m.funcname:m.saddr }}</el-button
                >
              </div>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
      <el-card class="center">
        <el-descriptions title="进程执行指令" :column="1" />
        <div style="display: flex; flex-direction: row">
          <!-- <div style="width: 100px">指令序列:</div> -->
          <div class="logic">{{ logicName }}</div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, toRefs } from "vue";
export default {
  name: "ProcessDetail",
  props: ["rowInfos"],
  setup(props, { emit }) {
    const state = reactive({
      logicName: "",
      rowInfo: {
        proc_name: "",
        record_time: "",
        user: "",
        proc_args: "",
        proc_path: "",
        list: [],
        source:"",
      },
      showNoData: true,
      trackInfo: null,
    });
    const funMethods = {
      show(info: any) {
        if (info) {
          state.showNoData = false;
          state.logicName = info.list[0].assemb;
          state.rowInfo = info;
        } else {
          state.rowInfo = {
            proc_name: "",
            record_time: "",
            user: "",
            proc_args: "",
            proc_path: "",
            list: [],
            source:"",
          };
          state.logicName = "";
          state.showNoData = true;
        }
      },
      trackShow(info: any) {
        if (info) {
        }
      },
    };
    const requestMethods = {};

    onMounted(() => {});

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
.row-content {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 168px);
  .top {
    flex: 1;
  }
  .center {
    flex: 1;
    margin-top: 10px;
    .logic {
      padding: 10px;
      height: 34vh;
      width: 30rem;
      overflow-y: auto;
      border: 1px solid gray;
      border-radius: 6px;
      white-space: pre-line;
    }
  }
  .bottom {
    flex: 1;
    margin-top: 10px;
  }
}

.funs-style {
  padding: 10px;
  height: 23vh;
  width: 30rem;
  overflow-y: auto;
  border: 1px solid gray;
  border-radius: 6px;
  display: flex;
  flex-direction: row;
}

:deep(.el-descriptions__body) {
  background-color: #021438;
}

:deep(.el-descriptions__title) {
  color: #fff !important;
}

:deep(.el-descriptions__label) {
  color: #fff;
}
:deep(.el-card) {
  background-color: #021438;
  border: #021438;
  color: #fff;
}

:deep(.el-descriptions__title) {
  color: gray;
  font-size: 18px;
}

.noData {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
:deep(.el-descriptions__content:not(.is-bordered-label)) {
  color: #fff;
}
</style>

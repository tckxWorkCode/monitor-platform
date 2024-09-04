<template>
  <div class="row-content">
    <!-- <div v-if="showNoData" class="noData"><img :src="require('@/assets/nodata.png')"/></div> -->
    <div>
      <el-card class="top">
        <el-descriptions title="基础信息" column="2">
          <el-descriptions-item label="用户:">{{ rowInfo?.user }}</el-descriptions-item>
          <el-descriptions-item label="上报时间:">{{ rowInfo?.recordTime }}</el-descriptions-item>
          <el-descriptions-item label="跟踪点地址:">
            <div class="funs-style">
              <!-- <div v-for="m in rowInfo?.hook_list"> -->
                <el-button
                  v-if="rowInfo?.traceAddr"
                  style="margin-right: 10px"
                  >{{ rowInfo?.traceAddr }}</el-button
                >
              <!-- </div> -->
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
      <el-card class="center">
        <el-descriptions title="跟踪指令" column="1" />
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
        user: "",
        recordTime: "",
        traceAddr:'',
      },
      showNoData: true,
      trackInfo: null,
    });
    const funMethods = {
      show(info: any) {
        if (info) {
          state.rowInfo = info;
          state.logicName = info.assemb;
        } else {
          state.rowInfo = {
            user:'',
            recordTime: "",
            traceAddr: '',
          };
          state.logicName = "";
          // state.showNoData = true;
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
  height: calc(100vh - 182px);
  // background-color: #021438;
  .top {
    flex: 1;
  }
  .center {
    flex: 1;
    margin-top: 10px;
    .logic {
      padding: 10px;
      height: 40vh;
      width: 39vw;
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
  width: 29rem;
  overflow-y: auto;
  border: 1px solid gray;
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
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

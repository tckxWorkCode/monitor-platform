<template>
  <div class="bottom-list">
    <!-- <el-scrollbar style="height: 100%" ref="scrollbar"> -->
    <!-- <el-button title="更多信息" class="more" @click="getMore">
       更多信息
      </el-button> -->
    <!-- <dv-scroll-board
        :config="config"
        id="my-scroll-list"
        style="width: 100%; height: 27vh; margin-left: 0px"
        /> -->
    <!-- </el-scrollbar> -->
    <TableWapper
      style="height: 26vh; max-height: 26vh"
      :colConfigs="colConfigs"
      :tableData="tableData"
    >
      <template #alarm_level>
        <el-table-column label="告警等级" v-slot="scope" width="150">
          <el-tag :style="`color:${colorEnum[scope.row.alarm_level]};background-color:transparent`">{{ scope.row.alarm_level }}</el-tag>
        </el-table-column>
      </template>
      <template #opt>
        <el-table-column style="width: 200px" label="操作" v-slot="scope">
          <!-- <el-button link @click="handleFun(scope.row._id)"> </el-button> -->
          <div style="display: flex; flex-direction: row; align-items: center">
            <span v-if="scope.row.handled=='已拦截'" style="color:#409eff">{{ scope.row.handled }}</span>
            <span v-else style="color: #00ff00;" @click="handleFontFun(scope.row._id)" class="handleOpt">
              {{ scope.row.handled }}
            </span>
            <img
              class="img-new"
              @click="handleEmailFun(scope.row)"
              style="height: 25px;margin-left: 18px;"
              :src="require('@/assets/home/email.png')"
            />
          </div>
        </el-table-column>
      </template>
    </TableWapper>
  </div>
</template>

<script lang="ts">
import { onBeforeUnmount, onMounted, reactive, toRefs } from "vue";
import believeApi from "@/api/bigScreen";
import { levelEnum } from "@/utils/enum";
import TableWapper from "@/components/Table/index.vue";
import router from "@/router";
import { ElMessage } from "element-plus";
import homeApi from "@/api/home";

export default {
  name: "BottomList",
  components: { TableWapper },
  emits: ["onHandleFinish"],
  setup(props, { emit }) {
    const levelEnum = {
      1: "低级",
      2: "中级",
      3: "高级",
      4: "严重",
    };
    const state = reactive({
      levelEnum,
      colConfigs: [
        { slot: "index" },
        { slot: "alarm_level" },
        { label: "主机IP", prop: "machine_ip" },
        { label: "风险分数", prop: "risk_score" },
        { label: "攻击动作", prop: "" },  //时间线的攻击动作
        { label: "告警类型", prop: "alert_type" },
        { label: "告警原因", prop: "reason", width: "800px" },
        { label: "上报时间", prop: "@timestamp",width:'200px' },
        { slot: "opt" },
      ],
      levelType: {
        高级: "danger",
        中级: "warning",
        严重: "success",
        低级: "info",
      },
      colorEnum:{
        严重:'#FF0000',
        高级:'#FF9900',
        中级:'#FFFF00',
        低级:'#00FF00',
      },
      tableData: [],
      timer: null,
      count: 0,
    });
    const funMethods = {
      getMore() {},
    };
    const requestMethods = {
      async handleEmailFun(rowInfo: any) {
        // 调发邮件的接口
        const payload = {
          ip: rowInfo.machine_ip ? rowInfo.machine_ip : "",
          content: rowInfo.reason,
        };
        const res = await homeApi.handleEmail(payload);
        if (res.code == 602) {
          return;
        } else {
          ElMessage.success("邮件发送成功");
          setTimeout(() => {
            requestMethods.getNewList();
          }, 2000);
        }
      },
      async handleFontFun(rowId: any) {
        // 调处置的接口
        const payload = {
          ids: [rowId],
          status: 1,
        };
        const res = await homeApi.handle(payload);
        if (res.code == 602) {
          return;
        } else {
          ElMessage.success("处置成功");
          setTimeout(() => {
            requestMethods.getNewList();
          }, 1000);
          emit("onHandleFinish");
        }
      },
      // 获取列表
      async getListFun() {
        state.timer = setInterval(async () => {
          requestMethods.getNewList();
        }, 3000);
      },
      async getNewList() {
        // page:1,size:10
        const res = await homeApi.warnList({});
        const newData = res.list.map((m: any) => {
          return {
            ...m,
            risk_score: m.signal.rule.risk_score,
            alarm_level: m.signal.rule.severity,
            reason: m.signal.reason,
          };
        });
        state.tableData = newData;
      },
    };

    onMounted(() => {
      requestMethods.getNewList();
      // requestMethods.getListFun();
    });

    onBeforeUnmount(() => {
      clearInterval(state.timer);
    });

    return {
      levelEnum,
      ...toRefs(state),
      ...funMethods,
      ...requestMethods,
    };
  },
};
</script>

<style lang="scss" scoped>
.bottom-list {
  padding: 20px;
  // height: 76%;
  // width: calc(100% - 40px);
  color: #fff;
  .more {
    color: #fff;
    position: absolute;
    float: right;
    right: 26px;
    top: 0px;
    z-index: 99999;
    background: #012e5c;
    border: none;
  }
}

:deep(.el-table__body-wrapper) {
  background-color: #05162f;
}

.img-new,
.handleOpt {
  color: #1296db;
  &:hover {
    cursor: pointer;
  }
}
.handleOpt {
  margin-left: 3px;
}
</style>

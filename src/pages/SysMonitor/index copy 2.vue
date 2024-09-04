<template>
  <div class="sys-monitor">
    <div class="content">
      <div class="content-left-list">
        <div class="node-title">终端列表</div>
        <div v-for="m in nodeList">
          <div
            :class="
              nodeId && m.id == nodeId ? 'node-item node-select' : 'node-item'
            "
            @click="changeNodeFun(m.id)"
          >
            <!-- :title="m.ip" -->
            <el-popover
              placement="top-end"
              :width="60"
              trigger="hover"
              :content="m.ip"
            >
              <template #reference>
                <span>{{ m.name }}</span>
              </template>
            </el-popover>
          </div>
        </div>
      </div>
      <div class="content-right">
        <div class="item-content left">
          <div class="left-item">
            <div class="title">进程列表</div>
            <TableWapper
              class="newTable"
              :colConfigs="colConfigs"
              :tableData="tableData"
            >
              <template #option>
                <el-table-column label="操作" v-slot="scope" width="60px">
                  <div
                    v-if="scope.row.name"
                    class="detail"
                    title="详情"
                    @click="processOneFun(scope.row)"
                  >
                    详情
                  </div>
                </el-table-column>
              </template>
            </TableWapper>
          </div>
          <div class="left-item">
            <div class="title">跟踪点</div>
            <el-tabs
              v-model="activeName"
              class="demo-tabs"
              @tab-change="handleClick"
            >
              <el-tab-pane label="tracepoint" name="tracepoint"> </el-tab-pane>
              <el-tab-pane label="ftrace" name="ftrace"> </el-tab-pane>
              <el-tab-pane label="kprobe" name="kprobepoint"> </el-tab-pane>
            </el-tabs>
            <TableWapper
              class="newTable"
              :colConfigs="colConfigs2"
              :tableData="tableData2"
            >
              <template #addr>
                <el-table-column label="挂钩地址" v-slot="scope">
                  <div v-if="scope.row.callback.addr">
                    {{ scope.row.callback.addr }}
                  </div>
                </el-table-column>
              </template>
              <template #option>
                <el-table-column label="操作" v-slot="scope" width="60px">
                  <div
                    v-if="scope.row.name"
                    class="detail"
                    title="详情"
                    @click="trackFun(scope.row.callback)"
                  >
                    详情
                  </div>
                </el-table-column>
              </template>
            </TableWapper>
          </div>
          <div class="left-item">
            <div class="title">可信通道</div>
            <el-tabs
              v-model="activeName1"
              class="demo-tabs"
              @tab-change="handleClick1"
            >
              <el-tab-pane label="systemfile" name="filesystem"> </el-tab-pane>
              <el-tab-pane label="blockdriver" name="blockdriver">
              </el-tab-pane>
              <el-tab-pane label="scsidriver" name="scsidriver"> </el-tab-pane>
            </el-tabs>
            <TableWapper
              class="newTable"
              :colConfigs="colConfigs3"
              :tableData="tableData3"
            >
              <template #pointer>
                <el-table-column label="操作" v-slot="scope" width="60px">
                  <div
                    class="detail"
                    title="详情"
                    @click="attrListFun(scope.row.pointer)"
                  >
                    详情
                  </div>
                </el-table-column>
              </template>
            </TableWapper>
          </div>
          <div class="left-item">
            <div class="title">内核线程</div>
            <TableWapper
              class="newTable"
              :colConfigs="colConfigs4"
              :tableData="tableData4"
            >
              <template #option>
                <el-table-column label="操作" v-slot="scope" width="60px">
                  <div
                    v-if="scope.row.name"
                    class="detail"
                    title="详情"
                    @click="processFun(scope.row)"
                  >
                    详情
                  </div>
                </el-table-column>
              </template>
            </TableWapper>
          </div>
          <div class="left-item">
            <div class="title">内核代码区</div>
            <TableWapper
              class="newTable"
              :colConfigs="colConfigs1"
              :tableData="tableData1"
            >
            </TableWapper>
          </div>
        </div>
        <div class="item-content">
          <div v-if="showDetail == true">
            <div class="detal-title-style">详细信息</div>
            <div>
              <div v-for="m in detailInfoData">
                <Description :label="m.label" :value="m.value" />
              </div>
            </div>
          </div>
          <div v-if="showOneDetail == true">
            <div class="oneDetail">异常进程信息</div>
            <ProcessDetail :rowInfo="rowInfo"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onBeforeUnmount, onMounted, reactive, toRefs } from "vue";
import sysMonitorApi from "@/api/sysMonitor";
import TableWapper from "@/components/Table/index.vue";
import Description from "@/components/Descriptions/index.vue";
import trustEnums from "@/utils/enum";
import ProcessDetail from "./components/processDetail.vue";
import "./index.scss";

export default {
  name: "SysMonitor",
  components: { TableWapper, Description, ProcessDetail },
  setup() {
    const state = reactive({
      // 详细信息
      detailInfoData: [],
      nodeList: [],
      colConfigs: [
        { slot: "index" },
        { label: "名称", prop: "name" },
        { label: "状态", prop: "state" },
        // { label: "调试", prop: "ptrace" },
        // { label: "页表", prop: "pgd" },
        { label: "进程ID", prop: "pid" },
        { label: "父进程ID", prop: "ppid" },
        { slot: "option" },
      ],
      tableData: [],
      colConfigs4: [
        { slot: "index" },
        { label: "名称", prop: "name" },
        { label: "状态", prop: "state" },
        // { label: "调试", prop: "ptrace" },
        // { label: "页表", prop: "pgd" },
        { label: "线程ID", prop: "pid" },
        { label: "父线程ID", prop: "ppid" },
        { slot: "option" },
      ],
      tableData4: [],
      colConfigs1: [
        { slot: "index" },
        { label: "模块名", prop: "name" },
        { label: "开始地址", prop: "start" },
        { label: "结束地址", prop: "lend" },
      ],
      tableData1: [],
      colConfigs2: [
        { slot: "index" },
        { label: "挂钩地址", prop: "source_addr" },
        { label: "函数地址", prop: "target_addr" },
      ],
      tableData2: [],
      colConfigs3: [
        { slot: "index" },
        { label: "名称", prop: "name" },
        { label: "下一层名称", prop: "exname" },
        { slot: "pointer" },
      ],
      tableData3: [],
      activeName: "tracepoint",
      activeName1: "filesystem",
      nodeId: "",
      showDetail: false,
      showOneDetail: false,
      rowInfo:{},
    });
    const funMethods = {
      handleClick(name: any) {
        requestMethods.getDetailFun(name, state.activeName1);
      },
      handleClick1(name: any) {
        requestMethods.getDetailFun(state.activeName, name);
      },
      changeNodeFun(id: any) {
        state.showDetail = false;
        state.activeName = "tracepoint";
        state.activeName1 = "filesystem";
        state.nodeId = id;
        requestMethods.getDetailFun(state.activeName, state.activeName1);
      },
      trackFun(info: any) {
        state.showDetail = true;
        state.showOneDetail = false;
        state.detailInfoData = [
          { label: "模块名", value: info.module },
          { label: "函数名", value: info.name },
          { label: "偏移量", value: info.offset },
          { label: "长度", value: info.size },
        ];
      },
      processOneFun(info: any) {
        state.showOneDetail = true;
        state.showDetail = false;
        state.rowInfo = info
      },
      processFun(info: any) {
        state.showDetail = true;
        state.showOneDetail = false;
        state.detailInfoData = [
          { label: "名称", value: info.name },
          { label: "进程id", value: info.pid },
          { label: "父进程id", value: info.ppid },
          { label: "用户id", value: info.uid },
          { label: "当前用户id", value: info.uid },
          { label: "组id", value: info.uid },
          { label: "栈起始地址", value: info.stack_start },
          { label: "映射基址", value: info.mmap_base },
          { label: "堆地址", value: info.start_brk + "-" + info.brk },
          { label: "数据段地址", value: info.start_data + "-" + info.end_data },
          { label: "代码段地址", value: info.start_code + "-" + info.end_data },
          { label: "环境变量地址", value: info.env_start + "-" + info.env_end },
          { label: "页表", value: info.pgd },
          { label: "调试状态", value: info.ptrace },
          { label: "当前状态", value: info.state },
          { label: "退出状态", value: info.exit_state },
          { label: "退出码", value: info.exit_code },
        ];
      },
      attrListFun(info: any) {
        state.showDetail = true;
        state.showOneDetail = false;
        if (!info) {
          return;
        }
        const newData = info.split(",");
        let newArry = [];
        if (state.activeName1 == "filesystem") {
          newArry = trustEnums.filesystemEnum.map((m, i) => {
            return {
              label: m,
              value: newData[i],
            };
          });
        } else if (state.activeName1 == "blockdriver") {
          newArry = trustEnums.blockdriverEnum.map((m, i) => {
            return {
              label: m,
              value: newData[i],
            };
          });
        } else {
          newArry = trustEnums.scsidriverEnum.map((m, i) => {
            return {
              label: m,
              value: newData[i],
            };
          });
        }
        state.detailInfoData = newArry;
      },
    };
    const requestMethods = {
      // 获取终端列表
      async getNode() {
        const params = {
          page: 1,
          size: 1000,
        };
        const res = await sysMonitorApi.getHostIpInfo(params);
        state.nodeList = res.list.map((m: any) => {
          return {
            name: m.hostInfo.name,
            id: m.hostInfo.id,
            state: m.hostInfo.state,
            ip: m.hostInfo.ip[0],
          };
        });
        const getHomeIp = sessionStorage.getItem("toSysIp");
        if (getHomeIp) {
          // 当前终端不匹配
          const newObj: any = state.nodeList.filter((m) => m.ip == getHomeIp);
          state.nodeId = newObj[0].id;
        } else {
          state.nodeId = state.nodeList.length > 0 ? state.nodeList[0].id : "";
        }
        requestMethods.getDetailFun(state.activeName, state.activeName1);
      },
      // 获取终端详细信息
      async getDetailFun(name: any, name1: any) {
        if (!state.nodeId) {
          return;
        }
        const res = await sysMonitorApi.detailNodeInfo({ id: state.nodeId });
        if (res.length == 0) {
          state.tableData = [];
          state.tableData1 = [];
          state.tableData2 = [];
          state.tableData3 = [];
          return;
        }
        state.tableData = res[0].thread_list;
        state.tableData1 = res[0].kenel_range;
        state.tableData4 = res[0].kernel_thread;
        if (name == "ftrace") {
          state.tableData2 = res[0].ftrace;
          state.colConfigs2 = [
            { slot: "index" },
            { label: "挂钩地址", prop: "source_addr" },
            { label: "函数地址", prop: "target_addr" },
          ];
        } else if (name == "tracepoint") {
          state.tableData2 = res[0].tracepoint;
          state.colConfigs2 = [
            { slot: "index" },
            { label: "挂钩函数名称", prop: "name" },
            { slot: "addr" },
            { slot: "option" },
          ];
        } else if (name == "kprobepoint") {
          state.tableData2 = res[0].kprobepoint;
          state.colConfigs2 = [
            { slot: "index" },
            { label: "挂钩地址", prop: "source_addr" },
            { label: "前处理", prop: "pre_addr" },
            { label: "后处理", prop: "post_addr" },
            { label: "失败处理", prop: "fault_addr" },
          ];
        }

        if (name1 == "filesystem") {
          state.tableData3 = res[0].filesystem.map((m) => {
            return {
              ...m,
              pointer: m.pointers.join(","),
            };
          });
        } else if (name1 == "blockdriver") {
          state.tableData3 = res[0].blockdriver.map((m) => {
            return {
              ...m,
              pointer: m.pointers.join(","),
            };
          });
        } else if (name1 == "scsidriver") {
          state.tableData3 = res[0].scsidriver.map((m) => {
            return {
              ...m,
              pointer: m.pointers.join(","),
            };
          });
        }
      },
    };

    onMounted(() => {
      requestMethods.getNode();
    });

    onBeforeUnmount(() => {
      sessionStorage.removeItem("toSysIp");
    });

    return {
      ...toRefs(state),
      ...funMethods,
      ...requestMethods,
    };
  },
};
</script>

<style lang="scss" scoped>
.sys-monitor {
  height: calc(100vh - 100px);
  width: 100%;
  background-image: url("../../assets/bigScreen/menu/backImg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  color: #fff;

  .content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    height: calc(100% - 20px);

    .title {
      color: #fff;
      font-size: 18px;
      &:nth-child(1),
      &:nth-child(2) {
        margin-bottom: 20px;
      }
    }

    .content-left-list {
      width: 300px;
      border-right: 1px solid #fff;
      padding-top: 20px;
      .node-title {
        text-align: center;
        margin-bottom: 30px;
        font-size: 18px;
      }

      .node-item {
        padding-left: 30px;
        height: 40px;
        line-height: 40px;
        background-color: #050d24;
        &:hover {
          color: #118cfe;
          cursor: pointer;
          background-color: #2c4672;
        }
      }

      .node-select {
        color: #118cfe;
        background-color: #2c4672;
        border-radius: 4px;
      }
    }

    .content-right {
      width: calc(100% - 302px);
      display: flex;
      flex-direction: row;
      height: 90vh;
      overflow-y: auto;
      .item-content {
        flex: 1;
        background-color: #050d24;
        overflow-y: auto;
        &:nth-child(1) {
          flex: 3;
          border-right: 1px solid #fff;
        }
      }
      .left {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow-y: auto;
        .left-item {
          flex: 1;
          background-color: #021438;
          margin-bottom: 10px;
          padding: 10px 20px;
          &:nth-child(4) {
            margin-bottom: 0px;
          }
        }
      }
    }
  }
}

.detail {
  color: #118cfe;
  &:hover {
    cursor: pointer;
  }
}

.detal-title-style {
  padding-left: 40px;
  font-size: 18px;
}

.newTable {
  height: 200px;
  max-height: 200px;
  min-height: 200px;
  overflow-y: auto;
}

.oneDetail{
  font-size: 18px;
  margin-bottom: 20px;
  margin-left: 10px
}
</style>

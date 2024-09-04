<template>
  <div class="content">
    <div v-if="ifShowTime == true" class="show-time"></div>
    <el-tabs type="border-card" @tab-change="handleClick" v-model="tabName">
      <el-tab-pane label="实时关联预警" :name="0">
        <TableWapper
          class="newTable"
          :colConfigs="colConfigs"
          :tableData="tableData"
          @sort-change="sortChangeFun"
        >
          <template #alarm_level>
            <el-table-column label="告警等级" v-slot="scope" width="100">
              <el-tag
                :style="`color:${
                  colorEnum[scope.row.alarm_level]
                };background-color:transparent`"
                >{{ levelEnum[scope.row.alarm_level] }}</el-tag
              >
            </el-table-column>
          </template>
          <template #extra_args>
            <el-table-column label="启动参数" v-slot="scope">
              {{ scope.row.extra_args }}
            </el-table-column>
          </template>
          <template #attck_desc>
            <el-table-column label="描述" v-slot="scope">
              {{ scope.row.attck_desc }}
            </el-table-column>
          </template>
          <template #alert_score>
            <el-table-column
              width="120"
              sortable="custom"
              prop="alert_score"
              label="风险分数"
              v-slot="scope"
            >
              {{ scope.row.alert_score }}
            </el-table-column>
          </template>
          <template #record_time>
            <el-table-column
              width="200"
              sortable="custom"
              prop="record_time"
              label="上报时间"
              v-slot="scope"
            >
              {{ scope.row.record_time }}
            </el-table-column>
          </template>
          <!-- <template #opt>
            <el-table-column style="width: 200px" label="操作" v-slot="scope">
              <el-button link @click="handleFun(scope.row.id)">处置</el-button>
            </el-table-column>
          </template> -->
        </TableWapper>
        <div class="pagination">
          <el-pagination
            v-model:current-page="page"
            v-model:page-size="size"
            :page-sizes="pageSizes"
            :total="total"
            :pager-count="11"
            layout="total, prev, pager, next,sizes"
            @current-change="currentFun"
            @size-change="sizeChangeFun"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="状态监测预警" :name="1">
        <TableWapper
          class="newTable"
          :colConfigs="colConfigs1"
          :tableData="tableData1"
          @sort-change="sortChangeFun"
        >
          <!-- <template #desc>
            <el-table-column style="width: 200px" label="描述" v-slot="scope">
              {{ scope.row.desc }}
            </el-table-column>
          </template> -->
          <template #alarm_level>
            <el-table-column label="告警等级" v-slot="scope" width="100">
              <el-tag
                :style="`color:${
                  colorEnum[scope.row.alarm_level]
                };background-color:transparent`"
                >{{ levelEnum[scope.row.alarm_level] }}</el-tag
              >
            </el-table-column>
          </template>
          <template #alert_score>
            <el-table-column
              width="120"
              sortable="custom"
              prop="alert_score"
              label="风险分数"
              v-slot="scope"
            >
              {{ scope.row.alert_score }}
            </el-table-column>
          </template>
          <template #record_time>
            <el-table-column
              width="200"
              sortable="custom"
              prop="record_time"
              label="上报时间"
              v-slot="scope"
            >
              {{ scope.row.record_time }}
            </el-table-column>
          </template>
        </TableWapper>
        <div class="pagination">
          <el-pagination
            v-model:current-page="page1"
            v-model:page-size="size1"
            :page-sizes="pageSizes1"
            :pager-count="11"
            :total="total1"
            layout="total, prev, pager, next,sizes"
            @current-change="currentFun1"
            @size-change="sizeChangeFun1"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="深度关联预警" :name="2">
        <TableWapper
          class="newTable"
          :colConfigs="colConfigs3"
          :tableData="tableData3"
          @sort-change="sortChangeFun"
        >
          <!-- <template #desc>
            <el-table-column style="width: 400px" label="描述" v-slot="scope">
              {{ scope.row.desc }}
            </el-table-column>
          </template> -->
          <template #alarm_level>
            <el-table-column label="告警等级" v-slot="scope" width="100">
              <el-tag
                :style="`color:${
                  colorEnum[scope.row.alarm_level]
                };background-color:transparent`"
                >{{ levelEnum[scope.row.alarm_level] }}</el-tag
              >
            </el-table-column>
          </template>
          <template #alert_score>
            <el-table-column
              width="120"
              sortable="custom"
              prop="alert_score"
              label="风险分数"
              v-slot="scope"
            >
              {{ scope.row.alert_score }}
            </el-table-column>
          </template>
          <template #record_time>
            <el-table-column
              width="200"
              sortable="custom"
              prop="record_time"
              label="上报时间"
              v-slot="scope"
            >
              {{ scope.row.record_time }}
            </el-table-column>
          </template>
        </TableWapper>
        <div class="pagination">
          <el-pagination
            v-model:current-page="page3"
            v-model:page-size="size3"
            :page-sizes="pageSizes2"
            :pager-count="11"
            :total="total3"
            layout="total, prev, pager, next,sizes"
            @current-change="currentFun3"
            @size-change="sizeChangeFun3"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="基础可信预警" :name="3">
        <TableWapper
          class="newTable"
          :colConfigs="colConfigs2"
          :tableData="tableData2"
          @sort-change="sortChangeFun"
        >
          <!-- <template #desc>
            <el-table-column style="width: 400px" label="描述" v-slot="scope">
              {{ scope.row.desc }}
            </el-table-column>
          </template> -->
          <template #severity>
            <el-table-column label="告警等级" v-slot="scope" width="100">
              <el-tag
                :style="`color:${
                  colorEnum[scope.row.alarm_level]
                };background-color:transparent`"
                >{{ scope.row.severity }}</el-tag
              >
            </el-table-column>
          </template>
          <template #record_time>
            <el-table-column
              sortable="custom"
              prop="record_time"
              label="上报时间"
              v-slot="scope"
            >
              {{ scope.row["@timestamp"] }}
            </el-table-column>
          </template>
        </TableWapper>
        <div class="pagination">
          <el-pagination
            v-model:current-page="page2"
            v-model:page-size="size2"
            :page-sizes="pageSizes2"
            :total="total2"
            :pager-count="11"
            layout="total, prev, pager, next,sizes"
            @current-change="currentFun2"
            @size-change="sizeChangeFun2"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, toRefs } from "vue";
import { ElMessage } from "element-plus";
import TableWapper from "@/components/Table/index.vue";
import detectApi from "@/api/bigScreen/index";
import attackApi from "@/api/attckBacktrack/index";
import rulesManApi from "@/api/rulesMan/index";
import PageSelect from "@/components/PageSelect/index.vue";

export default {
  name: "Content",
  props: ["formInfo"],
  emits: ["onChangeTab"],
  components: { TableWapper, PageSelect },
  setup(props, { emit }) {
    const levelEnum = {
      1: "低级",
      2: "中级",
      3: "高级",
      4: "严重",
    };
    const state = reactive({
      activeName: "first",
      tabName: 0,
      levelEnum,
      colorEnum: {
        4: "#FF0000",
        3: "#FF9900",
        2: "#FFFF00",
        1: "#00FF00",
      },
      selectTime: "",
      timeOptions: [],
      colConfigs: [
        { slot: "index" },
        { slot: "alarm_level" },
        { label: "主机IP", prop: "hostip", width: "130px" },
        { slot: "alert_score" },
        // { label: "行为分析", prop: "behavior_analyse" },
        // { label: "场景关联", prop: "sceneRef" },
        { label: "攻击动作", prop: "behavior" },
        { label: "战术", prop: "tactics" },
        { label: "技术", prop: "techniques" },
        { label: "主体名称", prop: "name" },
        { label: "客体名称", prop: "object" },
        { label: "操作", prop: "op" },
        { label: "描述", prop: "attck_desc", width: "600px" },
        { slot: "record_time" },
        { label: "启动参数", prop: "extra_args", width: "600px" },
      ],
      tableData: [],
      levelType: {
        1: "info",
        3: "danger",
        2: "warning",
        4: "success",
      },
      levelType1: {
        高级: "danger",
        中级: "warning",
        严重: "success",
        低级: "info",
      },
      page: 1,
      total: 0,
      size: 10,
      pageSizes: [10, 20, 50, 100],
      page1: 1,
      total1: 0,
      size1: 10,
      pageSizes1: [10, 20, 50, 100],
      colConfigs1: [
        { slot: "index" },
        { slot: "alarm_level" },
        { label: "主机IP", prop: "hostip", width: "130px" },
        { slot: "alert_score" },
        { label: "战术", prop: "tactics" },
        { label: "技术", prop: "techniques" },
        { label: "攻击动作", prop: "subtechniques" },
        { label: "度量对象", prop: "subject" },
        { label: "描述", prop: "desc", width: "600px" },
        { slot: "record_time" },
      ],
      tableData1: [],
      page2: 1,
      total2: 0,
      size2: 10,
      pageSizes2: [10, 20, 50, 100],
      colConfigs2: [
        { slot: "index" },
        // { slot: "severity" },
        { label: "主机IP", prop: "machine_ip", width: "130px" },
        // { label: "风险分数", prop: "risk_score" },
        { label: "系统类型", prop: "system" },
        { label: "告警类型", prop: "type" },
        { label: "客体", prop: "obj" },
        // { label: "告警原因", prop: "reason", width: "700px" },
        { label: "上报时间", prop: "time" },
        { label: "状态", prop: "handled" },
        // { slot: "record_time" },
      ],
      tableData2: [],
      colConfigs3: [
        { slot: "index" },
        { slot: "alarm_level" },
        { label: "主机IP", prop: "machine_ip", width: "130px" },
        { slot: "alert_score" },
        { label: "战术", prop: "tactics" },
        { label: "技术", prop: "techniques" },
        { label: "关联模型数", prop: "subtechniques" },
        // { label: "子技术", prop: "subtechniques", },
        // { label: "客体名称", prop: "object" },
        // { label: "操作", prop: "op" },
        // { label: "启动参数", prop: "extra_args", width: "600px" },
        { label: "描述", prop: "desc", width: "600px" },
        { slot: "record_time" },
      ],
      tableData3: [],
      page3: 1,
      size3: 10,
      total3: 0,
      payloadDim: 4,
      ifShowTime: false,
      order: "",
    });
    const funMethods = {
      async handleFun(rowId: any) {
        // 调处置的接口
        await detectApi.handle({});
        ElMessage.success("处置成功");
      },
      sortChangeFun(val) {
        if (val.order == "descending") {
          // 降序
          funMethods.handleClick(state.tabName, val.prop, 2);
          state.order = "2";
        } else if (val.order == "ascending") {
          // 升序
          funMethods.handleClick(state.tabName, val.prop, 1);
          state.order = "1";
        }
      },
      changeTab(){
        return state.tabName
      },
      handleClick(tab: any, prop: any, order: any) {
        state.tabName = tab;
        const getHomeIp = sessionStorage.getItem("toSysIp");
        if (tab == 0) {
          state.ifShowTime = false;
          requestMethods.getSysInfoFun(
            {
              ...props.formInfo,
              hostIp: props.formInfo.ip.ip == null ? "" : getHomeIp ? props.formInfo.ip.ip : props.formInfo.ip.ip,
              timeoffset: props.formInfo.timeoffsetIpt?props.formInfo.timeoffsetIpt + props.formInfo.timeoffset:'',
              page: state.page,
              size: state.size,
              dimensionality: state.payloadDim,
            },
            prop ? prop : "",
            order ? order : ""
          );
          emit("onChangeTab", state.ifShowTime);
        } else if (tab == 1) {
          state.ifShowTime = false;
          requestMethods.getCycleInfoFun(
            {
              ...props.formInfo,
              hostIp:
                props.formInfo.ip.ip == null
                  ? ""
                  : getHomeIp
                  ? props.formInfo.ip.ip
                  : props.formInfo.ip.ip,
              timeoffset: props.formInfo.timeoffsetIpt?props.formInfo.timeoffsetIpt + props.formInfo.timeoffset:'',
              page: state.page1,
              size: state.size1,
              dimensionality: state.payloadDim,
            },
            prop ? prop : "",
            order ? order : ""
          );
          emit("onChangeTab", state.ifShowTime);
        } else if (tab == 2) {
          state.ifShowTime = false;
          requestMethods.getAttackFun(
            {
              ...props.formInfo,
              hostIp:
                props.formInfo.ip.ip == null
                  ? ""
                  : getHomeIp
                  ? props.formInfo.ip.ip
                  : props.formInfo.ip.ip,
              timeoffset: props.formInfo.timeoffsetIpt?props.formInfo.timeoffsetIpt + props.formInfo.timeoffset:'',
              page: state.page3,
              size: state.size3,
              dimensionality: state.payloadDim,
            },
            prop ? prop : "",
            order ? order : ""
          );
          // requestMethods.getTimeFun();
          emit("onChangeTab", state.ifShowTime);
        } else if (tab == 3) {
          state.ifShowTime = true;
          requestMethods.getTrustInfoFun(
            {
              ...props.formInfo,
              hostIp:
                props.formInfo.ip.ip == null
                  ? ""
                  : getHomeIp
                  ? props.formInfo.ip.ip
                  : props.formInfo.ip.ip,
              timeoffset: props.formInfo.timeoffsetIpt?props.formInfo.timeoffsetIpt + props.formInfo.timeoffset:'',
              page: state.page2,
              size: state.size2,
            },
            prop ? prop : "",
            order ? order : ""
          );
          emit("onChangeTab", state.ifShowTime);
        }
      },
      currentFun(val: any) {
        state.page = val;
        // state.size = 10;
        const getHomeIp = sessionStorage.getItem("toSysIp");
        requestMethods.getSysInfoFun(
          {
            ...props.formInfo,
              hostIp:
                props.formInfo.ip.ip == null
                  ? ""
                  : getHomeIp
                  ? props.formInfo.ip.ip
                  : props.formInfo.ip.ip,
              timeoffset: props.formInfo.timeoffsetIpt?props.formInfo.timeoffsetIpt + props.formInfo.timeoffset:'',
              page: state.page,
              size: state.size,
              dimensionality: state.payloadDim,
          },
          "",
          ""
        );
      },
      currentFun1(val: any) {
        state.page1 = val;
        // state.size1 = 10;
        const getHomeIp = sessionStorage.getItem("toSysIp");
        requestMethods.getCycleInfoFun(
          {
            ...props.formInfo,
              hostIp:
                props.formInfo.ip.ip == null
                  ? ""
                  : getHomeIp
                  ? props.formInfo.ip.ip
                  : props.formInfo.ip.ip,
              timeoffset: props.formInfo.timeoffsetIpt?props.formInfo.timeoffsetIpt + props.formInfo.timeoffset:'',
              page: state.page1,
              size: state.size1,
              dimensionality: state.payloadDim,
          },
          "",
          ""
        );
      },
      currentFun2(val: any) {
        state.page1 = val;
        // state.size1 = 10;
        const getHomeIp = sessionStorage.getItem("toSysIp");
        requestMethods.getTrustInfoFun(
          {
            ...props.formInfo,
              hostIp:
                props.formInfo.ip.ip == null
                  ? ""
                  : getHomeIp
                  ? props.formInfo.ip.ip
                  : props.formInfo.ip.ip,
              timeoffset: props.formInfo.timeoffsetIpt?props.formInfo.timeoffsetIpt + props.formInfo.timeoffset:'',
              page: state.page2,
              size: state.size2,
          },
          "",
          ""
        );
      },
      currentFun3(val: any) {
        state.page3 = val;
        // state.size3 = 10;
        const getHomeIp = sessionStorage.getItem("toSysIp");
        requestMethods.getAttackFun(
          {
            ...props.formInfo,
              hostIp:
                props.formInfo.ip.ip == null
                  ? ""
                  : getHomeIp
                  ? props.formInfo.ip.ip
                  : props.formInfo.ip.ip,
              timeoffset: props.formInfo.timeoffsetIpt?props.formInfo.timeoffsetIpt + props.formInfo.timeoffset:'',
              page: state.page3,
              size: state.size3,
              dimensionality: state.payloadDim,
          },
          "",
          ""
        );
      },
      sizeChangeFun(val: any) {
        state.size = val;
        state.page = 1;
        const getHomeIp = sessionStorage.getItem("toSysIp");
        requestMethods.getSysInfoFun(
          {
            ...props.formInfo,
              hostIp:
                props.formInfo.ip.ip == null
                  ? ""
                  : getHomeIp
                  ? props.formInfo.ip.ip
                  : props.formInfo.ip.ip,
              timeoffset: props.formInfo.timeoffsetIpt?props.formInfo.timeoffsetIpt + props.formInfo.timeoffset:'',
              page: state.page,
              size: state.size,
              dimensionality: state.payloadDim,
          },
          "",
          ""
        );
      },
      sizeChangeFun1(val: any) {
        state.size1 = val;
        state.page1 = 1;
        const getHomeIp = sessionStorage.getItem("toSysIp");
        requestMethods.getCycleInfoFun(
          {
            ...props.formInfo,
              hostIp:
                props.formInfo.ip.ip == null
                  ? ""
                  : getHomeIp
                  ? props.formInfo.ip.ip
                  : props.formInfo.ip.ip,
              timeoffset: props.formInfo.timeoffsetIpt?props.formInfo.timeoffsetIpt + props.formInfo.timeoffset:'',
              page: state.page1,
              size: state.size1,
              dimensionality: state.payloadDim,
          },
          "",
          ""
        );
      },
      sizeChangeFun2(val: any) {
        state.size2 = val;
        state.page2 = 1;
        const getHomeIp = sessionStorage.getItem("toSysIp");
        requestMethods.getTrustInfoFun(
          {
            ...props.formInfo,
              hostIp:
                props.formInfo.ip.ip == null
                  ? ""
                  : getHomeIp
                  ? props.formInfo.ip.ip
                  : props.formInfo.ip.ip,
              timeoffset: props.formInfo.timeoffsetIpt?props.formInfo.timeoffsetIpt + props.formInfo.timeoffset:'',
              page: state.page2,
              size: state.size2,
          },
          "",
          ""
        );
      },
      sizeChangeFun3(val: any) {
        state.size = val;
        state.page = 1;
        const getHomeIp = sessionStorage.getItem("toSysIp");
        requestMethods.getAttackFun(
          {
            ...props.formInfo,
              hostIp:
                props.formInfo.ip.ip == null
                  ? ""
                  : getHomeIp
                  ? props.formInfo.ip.ip
                  : props.formInfo.ip.ip,
              timeoffset: props.formInfo.timeoffsetIpt?props.formInfo.timeoffsetIpt + props.formInfo.timeoffset:'',
              page: state.page3,
              size: state.size3,
              dimensionality: state.payloadDim,
          },
          "",
          ""
        );
      },

      resetFun(){
        state.page = 1;
        state.size =10
      },
      resetFun1(){
        state.page1 = 1;
        state.size1 =10
      },
      resetFun2(){
        state.page2 = 1;
        state.size2 =10
      },
      resetFun3(){
        state.page3 = 1;
        state.size3 =10
      },
    };
    const requestMethods = {
      // todo 系统调用的接口  listA
      async getSysInfoFun(payload: any, orderName: string, order: any) {
        payload = {
          ...payload,
          order: order,
          sortname: orderName,
          page: state.page,
          size: state.size,
        };
        state.payloadDim = payload.dimensionality;
        delete payload.ip;
        delete payload.timeoffsetIpt;
        delete payload.order;
        delete payload.sortname;
        const res: any = await detectApi.warnList(payload);
        const newData = res.list.map((m) => {
          return {
            ...m,
            // behavior_analyse: m.behavior_analyse.result,
            // sceneRef: m.attck.sceneRef,
            hostip: m.machine_ip,
            name: m.attck.name,
            tactics: m.attck.tactics,
            techniques: m.attck.techniques,
            object: m.attck.object,
            op: m.attck.op,
            extra_args: m.attck.extra_args,
            attck_desc: m.attck.desc.info,
          };
        });
        state.tableData = newData;
        state.total = res.total;
      },
      // todo  周期性接口  listB
      async getCycleInfoFun(payload: any, orderName: string, order: any) {
        payload = {
          ...payload,
          sortname: orderName,
          order: order,
          page: state.page1,
          size: state.size1,
        };

        delete payload.ip;
        delete payload.timeoffsetIpt;
        delete payload.order;
        delete payload.sortname;
        const res: any = await detectApi.warnInfoList(payload);
        const newData = res.list.map((m: any) => {
          return {
            ...m,
            hostip: m.machine_ip,
            subject: m.subject.name,
          };
        });
        state.tableData1 = newData;
        state.total1 = res.total;
      },

      // todo listC
      async getAttackFun(payload: any, orderName: string, order) {
        const payloads = {
          ...payload,
          sortname: orderName ? orderName : "",
          order: order ? order : "",
        };
        delete payloads.ip;
        delete payloads.timeoffsetIpt;
        delete payloads.order;
        delete payloads.sortname;
        const res: any = await detectApi.newTrust(payloads);

        state.tableData3 = res.list;
        state.total3 = res.total;
      },

      // todo listD
      async getTrustInfoFun(payload: any, orderName: string, order: any) {
        payload = {
          ...payload,
          sortname: orderName ? "attcks." + orderName : "",
          order: order,
          page: state.page2,
          size: state.size2,
        };
        delete payload.ip;
        delete payload.timeoffsetIpt;
        delete payload.order;
        delete payload.sortname;
        const newFormData = new FormData()
        newFormData.append('field','type')
        const resType:any = await rulesManApi.secondSelect(newFormData);
        const res: any = await detectApi.attackBackList(payload);
        const newData = res.list.map((m: any) => {
          const findObj = resType.find((obj:any) => Object.keys(obj).includes(m.type.toString()))
          return {
            ...m,
            type:m.type?findObj[m.type]:'',
          };
        });
        state.tableData2 = newData;
        state.total2 = res.total;
      },

      // 获取攻击回溯的时间下拉框
      async getTimeFun() {
        const payload = {
          id: props.formInfo.ip.id || "",
          page: 1,
          size: 1000,
        };
        const res = await attackApi.getProcessInfo(payload);
        state.timeOptions = res.list.map((m: any) => {
          return {
            label: m["@timestamp"],
            value: m._id,
          };
        });
      },
      changeTimeFun(val: any) {
        requestMethods.getAttackFun(
          {
            id: val,
            hostIp: props.formInfo.ip,
            page: state.page3,
            size: state.size3,
          },
          "",
          ""
        );
      },
    };

    onMounted(() => {
      // const getHomeIp = sessionStorage.getItem("toSysIp");
      // if (!getHomeIp) {
      //   requestMethods.getSysInfoFun({
      //     ...props.formInfo,
      //     hostIp: getHomeIp,
      //     page: state.page,
      //     size: state.size,
      //     dimensionality: state.payloadDim,
      //   },"","");
      // }
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
.content {
  position: relative;
  width: calc(100% - 20px);
  height: 100%;
  background-color: #05162f;
  color: #4f87ad;
  .el-tabs--border-card {
    background-color: #05162f;
    border: 1px solid #05162f;
  }

  .pagination {
    float: right;
  }

  .show-time {
    position: absolute;
    z-index: 9999;
    left: 600px;
    color: red;
  }
}

.newTable {
  height: 42vh;
  // min-height:42vh;
  // max-height:42vh;
  overflow-y: auto;
}
</style>

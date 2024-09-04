<template>
  <div class="attackBacktrack">
    <div class="content-left-list">
      <div class="node-title">终端列表</div>
      <div v-for="m in nodeList">
        <div
          :title="m.name"
          :class="
            nodeId && m.id == nodeId ? 'node-item node-select' : 'node-item'
          "
          @click="changeNodeFun(m.id)"
        >
          <div class="name-style">{{ m.name }}</div>
          <div>{{ "(" + m.ip + ")" }}</div>
        </div>
      </div>
    </div>
    <div class="contet-right">
      <div class="form-title" v-show="ifLength">
        <el-form v-model="form" :inline="true" style="display: flex">
          <el-form-item label="请选择视角">
            <el-select
              :disabled="ifShowProcess"
              v-model="form.view"
              @change="changeViewFun"
            >
              <div v-for="m in viewOptions" :key="m.value">
                <el-option :label="m.label" :value="m.value" />
              </div>
            </el-select>
          </el-form-item>
          <el-form-item label="历史回溯快照" v-if="form.view != 'timeline'">
            <el-select
              :disabled="ifShowProcess"
              v-model="form.timeHistory"
              @change="changeTimeFun"
            >
              <div v-for="m in timeOptions" :key="m.value">
                <el-option :label="m.label" :value="m.value" />
              </div>
            </el-select>
          </el-form-item>
          <el-form-item label="时间范围" v-if="form.view == 'timeline'">
            <el-date-picker
              @change="changeTimeRangeFun"
              v-model="form.timeRangeValue"
              type="datetimerange"
              value-format="YYYY-MM-DD HH:mm:ss"
              range-separator="~"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item label="分数" v-if="form.view == 'timeline'">
            <el-input-number
              v-model="form.lowScore"
              :min="0"
              :max="100"
              :controls="false"
            ></el-input-number>
            <span style="color: #fff; margin: 0 10px; line-height: 33px"
              >-</span
            >
            <el-input-number
              @change="changHighScoreFun"
              v-model="form.highScore"
              :min="0"
              :max="100"
              :controls="false"
            ></el-input-number>
          </el-form-item>
          <el-button
            v-if="form.view == 'attck'"
            type="primary"
            @click="openFun"
            :disabled="ifShowProcess"
            >播放</el-button
          >
          <el-button
            v-if="form.view == 'process'"
            type="primary"
            @click="importImgFun"
            >导出图片</el-button
          >
          <el-button
            v-if="form.view == 'timeline'"
            type="primary"
            @click="getTimeLineFun"
            >查询</el-button
          >
          <el-button v-if="ifShowProcess" @click="callBackAttck"
            >返回</el-button
          >
        </el-form>
      </div>
      <div>
        <div v-if="form.view == 'attck'">
          <AttckView ref="attckRef" @changeAttckProcess="changeAttckProcess" />
        </div>
        <div v-if="form.view == 'process'">
          <ProcessTree ref="processRef" />
        </div>
        <div v-if="form.view == 'timeline'">
          <TimeLineVisual ref="timeLineRef" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, toRefs } from "vue";
import attckBackApi from "@/api/attckBacktrack/index";
import AttckView from "./components/AttckView.vue";
import ProcessTree from "./components/ProcessTree.vue";
import TimeLineVisual from "./components/TimeLineVisual.vue";
import moment from "moment";
import './index.scss';

export default {
  name: "AttackBacktrack",
  components: { AttckView, ProcessTree, TimeLineVisual },
  setup() {
    const state = reactive({
      ifLength: true,
      loading: false,
      ifShowProcess: false,
      attckRef: null, //攻击视角ref
      processRef: null, //进程视角ref
      timeLineRef: null, //时间线ref
      nodeList: [],
      nodeId: "",
      form: {
        view: "attck",
        timeHistory: "",
        timeRangeValue: ["", ""],
        lowScore: 0,
        highScore: 100,
      },
      viewOptions: [
        { label: "ATT&CK框架视角", value: "attck" },
        { label: "进程树视角", value: "process" },
        { label: "时间线视角", value: "timeline" },
      ],
      timeOptions: [],
      processData: {},
    });
    const funMethods = {
      // 切换视角
      changeViewFun(val) {
        if (val == "attck") {
          requestMethods.getNodeBack(state.form.timeHistory);
        } else if (val == "process") {
          requestMethods.getNodeBack(state.form.timeHistory);
        } else if (val == "timeline") {
          funMethods.getNowDate();
          requestMethods.getTimeLineFun();
          requestMethods.getLegendFun();
        }
      },
      callBackAttck() {
        state.ifShowProcess = false;
        state.attckRef.changeStatue();
        requestMethods.getNodeBack(state.form.timeHistory);
        // state.processRef.refresh();
      },
      changeAttckProcess() {
        state.ifShowProcess = true;
      },
      changeTimeFun(val) {
        if(state.form.view == 'attck'){
          state.attckRef.resetBtn();
        }
        requestMethods.getNodeBack(val);
      },
      changeNodeFun(val) {
        state.nodeId = val;
        state.form.view = "attck";
        // const timer = setInterval(()=>{
        //   // console.log(11);
          
        //   // state.attckRef.initTable();
        //   state.attckRef.resetBtn();
        //   // state.attckRef.refresh();
        // },100)

        // setTimeout(()=>{
        //   clearInterval(timer)
        // },5000)
        state.attckRef.changeStatue();
        state.ifShowProcess=false;
        requestMethods.getTimeHistory();
      },
      changeTimeRangeFun(val) {
        state.form.timeRangeValue = val;
        requestMethods.getTimeLineFun();
      },
      changHighScoreFun(val: any) {
        if (val < state.form.lowScore) {
          state.form.highScore = state.form.lowScore;
          state.form.lowScore = val;
        }
      },
      // 时间线获取最近五分钟
      getNowDate() {
        const now = new Date();
        const firstTime = moment(now).format("YYYY-MM-DD HH:mm:ss");
        const lastTime = moment(firstTime)
          .subtract(5, "minute")
          .format("YYYY-MM-DD HH:mm:ss");
        state.form.timeRangeValue = [lastTime, firstTime];
      },

      // 导出进程树图片
      importImgFun() {
        state.processRef.importImgFun();
      },

      // attck播放事件
      openFun() {
        state.attckRef.resetBtn();
        state.attckRef.openLookFun();
      },
    };
    const requestMethods = {
      // 获取终端列表
      async getNode() {
        const params = {
          page: 1,
          size: 1000,
        };
        const res = await attckBackApi.getHostIpInfo(params);
        if (res.list.length == 0) {
          state.ifLength = false;
        } else {
          state.ifLength = true;
        }
        state.nodeList = res.list.map((m: any) => {
          return {
            name: m.hostInfo.name,
            id: m.hostInfo.id,
            state: m.hostInfo.state,
            ip: m.hostInfo.ip[0],
          };
        });
        state.nodeId = state.nodeList.length > 0 ? state.nodeList[0].id : "";
        // requestMethods.getDetailFun(state.activeName);
        requestMethods.getTimeHistory();
      },
      // 获取历史回溯快照的时间信息
      async getTimeHistory() {
        const payload = {
          id: state.nodeId,
          page: 1,
          size: 1000,
        };
        const res = await attckBackApi.getProcessInfo(payload);
        if (res.list.length > 0) {
          const newData = res.list.map((m) => {
            return {
              label: m["@timestamp"],
              value: m._id,
            };
          });
          state.timeOptions = newData;
          state.form.timeHistory = state.timeOptions[0].value;
          requestMethods.getNodeBack(state.form.timeHistory);
        }else{
          state.attckRef.refresh();
          state.timeOptions=[];
          state.form.timeHistory=''
        }
      },

      // 通过历史回溯获取树节点所有信息
      async getNodeBack(val) {
        if (!val) {
          return;
        }
        state.loading = true;
        state.processData = {};
        const response = await attckBackApi.getNodeInfo(
          {
            processId: val,
          },
          () => {
            state.loading = false;
          }
        );
        state.loading = false;
        state.processData = response[0];
        if (state.form.view == "attck") {
          state.attckRef.modelData3(state.processData);
          state.attckRef.resetBtn();
          state.attckRef.refresh();
          state.attckRef.initTable();
        } else {
          state.processRef.refresh();
          state.processRef.modelData(state.processData);
          state.processRef.initGraph();
        }
      },

      // 获取时间线的数据
      async getTimeLineFun() {
        state.loading = true;
        const params = {
          hostId: state.nodeId,
          // scoreLv: state.process,
          startTime: state.form.timeRangeValue[0],
          endTime: state.form.timeRangeValue[1],
          lowScore: state.form.lowScore,
          highScore: state.form.highScore,
        };
        const res = await attckBackApi.getTimeLineData(params, () => {
          state.loading = false;
        });
        state.timeLineRef.showData(state.form.timeRangeValue, state.nodeId);
        state.timeLineRef.initCharts(res);
        // state.timeLineRef.showData(res)
      },
      // 获取时间线的图例
      async getLegendFun() {
        const res = await attckBackApi.getLegendData({});
        state.timeLineRef.show(res);
      },
    };

    onMounted(() => {
      requestMethods.getNode();
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
:deep(.el-select-dropdown__item.selected) {
  background-color: #05519a;
}

:deep(.el-form--inline .el-form-item) {
  margin-top: -2px !important;
}

.attackBacktrack {
  height: calc(100vh - 100px);
  width: 100vw;
  background-image: url("../../assets/bigScreen/menu/backImg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  color: #fff;
  display: flex;
  flex-direction: row;

  .content-left-list {
    height: calc(100vh - 140px);
    width: 300px;
    border-right: 1px solid #fff;
    padding-top: 20px;

    .node-title {
      text-align: center;
      margin-bottom: 30px;
      font-size: 22px;
    }

    .node-item {
      font-size: 22px;
      padding-left: 30px;
      height: 40px;
      line-height: 40px;
      background-color: #050d24;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding-right: 10px;
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

  .contet-right {
    height: calc(100vh - 140px);
    width: calc(100% - 300px);
    .form-title {
      margin-left: 30px;
      display: flex;
      flex-direction: row;
    }
  }
}

.name-style {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

:deep(.el-loading-mask) {
  opacity: 0.97;
  background-color: #03092d;
}
</style>

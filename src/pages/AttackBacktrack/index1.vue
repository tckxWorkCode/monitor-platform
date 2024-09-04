<template>
  <div class="attack-backtrack">
    <div class="nodeinfo">
      <div class="left-title">终端列表</div>
      <div class="new-tree-style">
        <div v-for="m in nodeList">
          <div
            :class="
              nodeId && m.id == nodeId ? 'node-item node-select' : 'node-item'
            "
            @click="getIPSnap(m)"
          >
            <div>{{ m.name }}</div>
            <div>{{ "(" + m.ip + ")" }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="condtion">
      <div>
        <span class="titleStyle">请选择视角: </span>
        <el-select
          v-model="modelValue"
          :disabled="modelDisabled"
          placeholder="请选择"
          @change="changeModel"
        >
          <el-option
            v-for="item in modelList"
            :key="item.id"
            :label="item.text"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <div v-show="!showTimeLine">
        <span class="titleStyle">历史回溯快照: </span>
        <el-select
          v-model="snapSelect"
          :disabled="snapDisabled"
          placeholder="请选择历史回溯快照"
          @change="getNodeBack"
          style="width: 240px"
        >
          <el-option
            v-for="item in snapData"
            :key="item._id"
            :label="item['@timestamp']"
            :value="item._id"
          >
          </el-option>
        </el-select>
      </div>
      <div
        v-show="showTimeLine == true"
        style="display: flex; align-items: center"
      >
        <span class="titleStyle">时间范围: </span>
        <el-date-picker
          @change="changeTimeRangeFun"
          v-model="timeRangeValue"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          range-separator="~"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </div>
      <div
        v-show="showTimeLine == true"
        style="display: flex; flex-direction: row"
      >
        <span class="titleStyle" style="width: 50px; line-height: 33px"
          >分数:
        </span>
        <el-input-number
          v-model="lowScore"
          :min="0"
          :max="100"
          :controls="false"
        ></el-input-number>
        <span style="color: #fff; margin: 0 10px; line-height: 33px">-</span>
        <el-input-number
          @change="changHighScoreFun"
          v-model="highScore"
          :min="0"
          :max="100"
          :controls="false"
        ></el-input-number>
        <!-- <el-select v-model="process" @change="changeLevelFun">
          <el-option label="小于30" value="1"></el-option>
          <el-option label="30 - 60" value="2"></el-option>
          <el-option label="大于60" value="3"></el-option>
        </el-select> -->
      </div>

      <div v-show="showTimeLine == true">
        <el-button
          type="primary"
          @click="timelineSearchFun"
          style="margin-left: 20px"
          >查询</el-button
        >
        <!-- <el-button @click="timelineResetFun" style="margin-left: 20px;">重置</el-button> -->
      </div>

      <!-- <div v-show="showTimeLine == true">
        <span class="titleStyle">进程: </span>
        <el-select v-model="process">
          <el-tree
            style="max-width: 600px"
            :data="nodeTreedata"
            :props="nodeTreeDefaultProps"
            @node-click="handleNodeClick"
          />
        </el-select>
      </div> -->
      <el-button
        v-show="modelValue == 3 && nodeList.length > 0"
        type="primary"
        @click="openLookFun"
        style="margin-left: 10px"
        >播放</el-button
      >
      <el-button v-show="showBack" @click="back">返回</el-button>
      <el-button
        v-show="modelValue == 1 && nodeList.length > 0"
        type="primary"
        @click="importImgFun"
        >导出图片</el-button
      >
    </div>
    <div
      class="treeinfo"
      id="treeinfo"
      :style="`overflow: ${modelValue == 3 ? 'auto' : 'hidden'};`"
    >
      <div v-show="showTimeLine == true">
        <TimeLineVisual ref="timeLineRef" />
      </div>
      <div id="tree" :style="`z-index:${showTimeLine == false ? '100' : '-100'};margin-top:${ modelValue == 3 ? '30px' : '0px' }`" ></div>
    </div>
    <el-dialog
      id="descDialog"
      class="zhuxiao"
      :title="title"
      width="40%"
      style="height: 44vh;"
      v-model="dialogFormVisible"
      @close="diaclose"
      :close-on-click-modal="false"
    >
      <el-table :data="tableData" style="width: 100%;background-color: #05162f;height: 32vh;overflow-y: auto;">
        <template slot="empty">
          <p>{{ dataText }}</p>
          <img v-if="emptytxt" src="@/assets/attackbacktrack/nodata1.png" />
        </template>
        <el-table-column
          type="index"
          :index="indexMethod"
          label="序号"
          width="80px"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="规则名称"
          width="300px"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="alert_score" label="风险分数"></el-table-column>
        <el-table-column prop="alarm_level" label="告警等级">
          <template v-slot="props">
            <div style="display: flex; align-items: center">
              <div
                v-if="props.row.alarm_level == '1'"
                style="
                  background-color: #00bf6f;
                  width: 52px;
                  height: 22px;
                  line-height: 22px;
                  text-align: center;
                "
              >
                低级
              </div>
              <div
                v-else-if="props.row.alarm_level == '2'"
                style="
                  background-color: #01b9f9;
                  width: 52px;
                  height: 22px;
                  line-height: 22px;
                  text-align: center;
                "
              >
                中级
              </div>
              <div
                v-else-if="props.row.alarm_level == '3'"
                style="
                  background-color: #cf7847;
                  width: 52px;
                  height: 22px;
                  line-height: 22px;
                  text-align: center;
                "
              >
                高级
              </div>
              <div
                v-else-if="props.row.alarm_level == '4'"
                style="
                  background-color: #ad1814;
                  width: 52px;
                  height: 22px;
                  line-height: 22px;
                  text-align: center;
                "
              >
                严重
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="tactics"
          label="战术"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="techniques"
          label="技术"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column
          width="150%"
          prop="behavior_analyse_result"
          label="行为分析结果"
        >
          <template v-slot="props">
            <span v-if="props.row.behavior_analyse_result == 0">正常</span>
            <span v-if="props.row.behavior_analyse_result == 1">异常</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="event_type"
          label="事件类型"
          show-overflow-tooltip
        >
          <template v-slot="props">
            <span v-if="props.row.event_type == '1'">敏感</span>
            <span v-if="props.row.event_type == '2'">小场景</span>
            <span v-if="props.row.event_type == '3'">常规</span>
            <span v-if="props.row.event_type == '4'">系统调用度量</span>
          </template>
        </el-table-column>
      </el-table>
      <div
        v-if="tableData.length === 0"
        style="float: right; margin-top: 36px; margin-bottom: 36px"
      ></div>
      <el-pagination
        v-if="tableData.length > 0"
        style="float: right; margin: 20px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total,prev, pager, next"
        :total="total"
        :pager-count="11"
      >
      </el-pagination>
    </el-dialog>
    <div id="record" @mouseleave="hideRecord">
      <div v-for="item in curTechAttcks" @click="handleItem(item)">
        {{ item.record_time }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onBeforeUnmount, onMounted, reactive, toRefs } from "vue";
import attackMatrixData from "../../utils/titleData";
import * as d3 from "d3";
import attckBackApi from "@/api/attckBacktrack/index";
import TimeLineVisual from "./components/TimeLineVisual.vue";
import moment from "moment";
import "./index.scss";
import { isNull } from "@/utils";
import domtoimage from "dom-to-image";
import { drag } from "d3-drag";

export default {
  name: "AttackBacktrack",
  components: { TimeLineVisual },
  setup() {
    const defaultProps = {
      label: "label",
      id: "id",
      status: "status",
    };

    interface Tree {
      label: string;
      children?: Tree[];
    }

    const state = reactive({
      lowScore: 0,
      highScore: 100,
      nodeList: [],
      timeLineRef: null,
      showTimeLine: false, //是否展示时间线视角
      timeRange: "", //时间线视角的时间范围
      process: "3", //时间线视角的进程
      attackMatrixData,
      defaultProps,
      num: 0,
      cavasOptions: {
        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
              value_area: 800,
            },
          },
          color: {
            value: "#dedede",
          },
          shape: {
            type: "polygon",
            stroke: {
              width: 0,
              color: "#000000",
            },
            polygon: {
              nb_sides: 5,
            },
          },
          opacity: {
            value: 0.5,
            random: false,
            anim: {
              enable: false,
              speed: 0.5,
              opacity_min: 0.1,
              sync: false,
            },
          },
          size: {
            value: 3,
            random: true,
            anim: {
              enable: false,
              speed: 40,
              size_min: 0.1,
              sync: false,
            },
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#87CEFA",
            opacity: 0.4,
            width: 1.8,
          },
          move: {
            enable: true,
            speed: 4,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200,
            },
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: {
              enable: true,
              mode: "repulse",
            },
            onclick: {
              enable: true,
              mode: "push",
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 400,
              line_linked: {
                opacity: 1,
              },
            },
            bubble: {
              distance: 400,
              size: 40,
              duration: 2,
              opacity: 8,
              speed: 3,
            },
            repulse: {
              distance: 80,
              duration: 0.4,
            },
            push: {
              particles_nb: 4,
            },
            remove: {
              particles_nb: 2,
            },
          },
        },
        retina_detect: false,
      },
      modelValue: 3,
      modelList: [
        { id: 3, text: "ATT&CK框架视角" },
        { id: 1, text: "进程树视角" },
        { id: 4, text: "时间线视角" },
        // {id:2,text:'客体关系视角'},
      ],
      dialogFormVisible: false,
      currentPage: 1,
      pageSize: 10,
      logData: [],
      emptytxt: false,
      total: 0,
      snapSelect: "",
      title: "",
      dataText: "",
      snapData: [],
      tableData: [],
      graphData: {
        nodes: [],
        links: [],
      },
      data: [],
      nodeId: {},
      processData: {},
      nodes: [],
      backHeader: null,
      backData: [],
      attackLinks: [],
      showBack: false,
      curTechAttcks: [],
      curTechAttcks1: [],
      curTechAttcks2: [],
      curTechAttcks3: [],
      curTechAttcks4: [],
      handles: [],
      modelDisabled: false,
      snapDisabled: false,
      edges_line: null,
      edges_text: null,
      nodes_img: null,
      nodes_text: null,
      rectNode: null,
      rect_text: null,
      desc_text: null,
      ack_text: null,
      radius: 16,
      img_h: 100,
      img_w: 280,
      nodeTreeDefaultProps: {
        children: "children",
        label: "label",
      },
      nodeTreedata: [],
      timeRangeValue: ["", ""],
    });
    const funMethods = {
      handleNodeClick(data: Tree) {
        console.log("这是拿到的树数据", data);
      },

      // 自定义函数来解析 translate 变换
      parseTranslate(transformString) {
        const translateRegex =
          /translate\(([-+]?\d+(\.\d+)?([eE][-+]?\d+)?),([-+]?\d+(\.\d+)?([eE][-+]?\d+)?)\)/;
        const match = transformString.match(translateRegex);
        if (match) {
          return {
            x: parseFloat(match[1]),
            y: parseFloat(match[4]),
          };
        }
        return { x: 0, y: 0 };
      },

      // 导出进程树图片
      importImgFun() {
        var svgElement = document.querySelector("#tree");

        domtoimage
          .toPng(svgElement)
          .then(function (dataUrl) {
            var a = document.createElement("a");
            a.download = "进程树.png";
            a.href = dataUrl;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          })
          .catch(function (error) {
            console.error("出错啦!", error);
          });
      },

      handleSizeChange(val: any) {
        state.pageSize = val;
        state.currentPage = 1;
        state.tableData = state.logData.slice(
          (state.currentPage - 1) * state.pageSize,
          state.currentPage * state.pageSize
        );
      },
      handleCurrentChange(val: any) {
        state.currentPage = val;
        state.tableData = state.logData.slice(
          (state.currentPage - 1) * state.pageSize,
          state.currentPage * state.pageSize
        );
      },
      indexMethod(index: any) {
        if (state.currentPage === 1) {
          if (index < 9) {
            return "0" + (index + 1);
          } else {
            return index + 1;
          }
        } else {
          return index + 1 + state.pageSize * (state.currentPage - 1);
        }
      },
      diaclose() {
        state.dialogFormVisible = false;
      },
      // todo 调用图表接口
      async getIPSnap(data) {
        state.snapData = [];
        state.processData = {};
        state.graphData.nodes = [];
        state.graphData.links = [];
        state.modelValue = 3;
        state.nodeId = data ? data.id : "";
        state.snapSelect = "";
        const payload = {
          // id: 'TbYCYYFHH2FlG7Ol80Dolt51kDp1m6Dd',
          id: state.nodeId,
          page: 1,
          size: 1000,
        };
        funMethods.resetBtn();
        const response = await attckBackApi.getProcessInfo(payload);
        state.snapData = response.list;
        if (state.snapData.length > 0) {
          state.snapSelect = state.snapData[0]._id;
          funMethods.getNodeBack();
        } else {
          state.graphData.nodes = [];
          state.graphData.links = [];
          funMethods.refresh();
          funMethods.initGraph();
        }
      },
      resetBtn() {
        for (var i = 1; i < 50; i++) {
          const a1 = document.getElementById(`newFloatDiv${i}`);
          const a2 = document.getElementById(`demo${i}`);
          if (a1 || a2) {
            a1.parentNode.removeChild(a1);
            a2.parentNode.removeChild(a2);
          } else {
            return;
          }
        }
      },
      refresh() {
        state.handles = [];
        d3.select("#tree").select("svg").remove();
      },
      // 播放节点的连线的滚动
      openLookFun() {
        let newDiv = document.getElementById("treeinfo");
        funMethods.resetBtn();
        funMethods.modelData3();
        funMethods.refresh();

        funMethods.initTable("openLook");
        newDiv.scrollLeft = 300;
      },
      changeModel(val: any) {
        state.modelValue = val;
        funMethods.resetBtn();
        if (state.modelValue == 1) {
          funMethods.modelData();
          funMethods.refresh();
          funMethods.initGraph();
          state.showTimeLine = false;
        } else if (state.modelValue == 2) {
          // funMethods.modelData2();
          // funMethods.refresh();
          // funMethods.initGraph();
          // state.showTimeLine = false;
        } else if (state.modelValue == 3) {
          funMethods.modelData3();
          funMethods.refresh();
          funMethods.initTable();
          state.showTimeLine = false;
        } else if (state.modelValue == 4) {
          state.showTimeLine = true;
          state.timeLineRef.clearBottom();
          funMethods.refresh();
          funMethods.getLegendFun();
          funMethods.getTimeLineFun();
        }
      },

      // 获取时间线的数据
      async getTimeLineFun() {
        const params = {
          hostId: state.nodeId,
          // scoreLv: state.process,
          startTime: state.timeRangeValue[0],
          endTime: state.timeRangeValue[1],
          lowScore: state.lowScore,
          highScore: state.highScore,
        };
        const res = await attckBackApi.getTimeLineData(params);
        state.timeLineRef.showData(state.timeRangeValue, state.nodeId);
        state.timeLineRef.initCharts(res);
        // state.timeLineRef.showData(res)
      },
      // 获取时间线的图例
      async getLegendFun() {
        const res = await attckBackApi.getLegendData({});
        state.timeLineRef.show(res);
      },
      changeLevelFun() {
        funMethods.getTimeLineFun();
      },
      changeTimeRangeFun(val) {
        state.timeRangeValue = val;
        funMethods.getTimeLineFun();
      },
      timelineResetFun() {
        state.process = "3";
        funMethods.getNowDate();
        funMethods.getTimeLineFun();
      },
      timelineSearchFun() {
        funMethods.getTimeLineFun();
      },
      async getNodeBack() {
        funMethods.resetBtn();
        state.processData = {};
        state.graphData.nodes = [];
        state.graphData.links = [];
        var form = new FormData();
        form.append("processId", state.snapSelect);
        //TODO 调用查询树节点的接口
        const response = await attckBackApi.getNodeInfo({
          processId: state.snapSelect,
        });

        state.processData = response[0];
        if (state.modelValue == 1) {
          funMethods.modelData();
          funMethods.refresh();
          funMethods.initGraph();
        } else if (state.modelValue == 2) {
          funMethods.modelData2();
          funMethods.refresh();
          funMethods.initGraph();
        } else if (state.modelValue == 3) {
          funMethods.modelData3();
          funMethods.refresh();
          funMethods.initTable();
        }
      },
      changHighScoreFun(val: any) {
        if (val < state.lowScore) {
          state.highScore = state.lowScore;
          state.lowScore = val;
        }
      },
      async node2Tree() {
        state.data = [];
        var form = {
          page: 1,
          size: 1000,
        };
        const response = await attckBackApi.getHostIpInfo(form);

        state.nodeList = response.list.map((m: any) => {
          return {
            name: m.hostInfo.name,
            id: m.hostInfo.id,
            state: m.hostInfo.state,
            ip: m.hostInfo.ip[0],
          };
        });
        // state.nodes = response.list;
        // state.nodes.forEach((node) => {
        //   state.data.push({
        //     id: node.hostInfo.id,
        //     label: node.hostInfo.name,
        //     status: node.hostInfo.state,
        //     ip: node.hostInfo.ip[0],
        //   });
        // });
        state.nodeId = state.nodeList.length > 0 ? state.nodeList[0].id : "";
        // console.log(state.nodeId,state.data[0].id);

        const newList = response.list.map((m: any) => {
          return {
            id: m.hostInfo.id,
            name: m.hostInfo.name,
            state: m.hostInfo.state,
            ip: m.hostInfo.ip[0],
          };
        });
        funMethods.getIPSnap(newList[0]);
      },
      initGraph() {
        // debugger;
        let treeContainer = document.getElementById("tree");
        // var width =  treeContainer.clientWidth == 0 ?2259 :treeContainer.clientWidth;
        // var height = treeContainer.clientHeight == 0 ? 1205:treeContainer.clientHeight;
        var width = treeContainer.clientWidth;
        var height = treeContainer.clientHeight;

        // console.log(width,height);

        var svg = d3
          .select("#tree")
          .append("svg")
          .attr("id", "graph")
          .attr("width", width)
          .attr("height", height);
        var svg_g = svg.append("g").attr("transform", "scale(1)");

        var tranX = 50;
        var tranY = 50;
        var scale = 1;
        var transform = d3.zoomTransform(d3.select("svg"));
        var zoom = d3
          .zoom()
          .scaleExtent([0.1, 10])
          .on("zoom", function (event) {
            // 监听缩放事件 event是拿到的dom元素
            transform = d3.zoomTransform(this);
            scale = transform.k;
            svg_g.attr("transform", transform);
          });
        // 调用
        svg.call(zoom);
        var root = state.graphData;
        if (root.nodes.length == 0 && root.links.length == 0) {
          // (document.getElementById("particles") as any).style.zIndex = 100;
          // var nodata = require("../../assets/attackbacktrack/nodata1.png");
          svg
            .append("image")
            .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
            .attr("height", 164)
            .attr("width", 244)
            .attr("x", (width - 244) / 2)
            .attr("y", (height - 164) / 2);
          return;
        }
        // .attr("xlink:href", nodata);
        // (document.getElementById("particles") as any).style.zIndex = -100;
        var marginY = 20;
        var marginX = 50;
        var lineMinLenth = 120;
        var lineMaxLenth = 200;
        var svgRect = d3.select("#graph").node().getBoundingClientRect();
        var normalNode = require("../../assets/attackbacktrack/status_normal.png");
        var errorNode = require("../../assets/attackbacktrack/status_error.png");
        var personTxt = require("../../assets/attackbacktrack/no.png");
        var normalTextNode = require("../../assets/attackbacktrack/normal.png");
        var errorTextNode = require("../../assets/attackbacktrack/error.png");
        var maxLayer = Math.max(
          ...root.nodes.map((node) => {
            return node.layer;
          })
        );
        var minLayer = Math.min(
          ...root.nodes.map((node) => {
            return node.layer;
          })
        );
        var lineLenth = svgRect.width / (maxLayer - minLayer);
        lineLenth = lineLenth > lineMinLenth ? lineLenth : lineMinLenth;
        lineLenth = lineLenth > lineMaxLenth ? lineMaxLenth : lineLenth;
        svg
          .append("defs")
          .append("pattern")
          .attr("patternContentUnits", "objectBoundingBox")
          .attr("id", "error")
          .attr("height", 1)
          .attr("width", 1)
          .append("image")
          .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
          .attr("height", 1)
          .attr("width", 1)
          .attr("preserveAspectRatio", "none")
          .attr("xlink:href", errorNode);
        svg
          .append("defs")
          .append("pattern")
          .attr("patternContentUnits", "objectBoundingBox")
          .attr("id", "normal")
          .attr("height", 1)
          .attr("width", 1)
          .append("image")
          .attr("height", 1)
          .attr("width", 1)
          .attr("preserveAspectRatio", "none")
          .attr("xlink:href", normalNode);
        svg
          .append("defs")
          .append("pattern")
          .attr("patternContentUnits", "objectBoundingBox")
          .attr("id", "error_text")
          .attr("height", 1)
          .attr("width", 1)
          .append("image")
          .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
          .attr("height", 1)
          .attr("width", 1)
          .attr("preserveAspectRatio", "none")
          .attr("xlink:href", errorTextNode);
        svg
          .append("defs")
          .append("pattern")
          .attr("patternContentUnits", "objectBoundingBox")
          .attr("id", "normal_text")
          .attr("height", 1)
          .attr("width", 1)
          .append("image")
          .attr("height", 1)
          .attr("width", 1)
          .attr("preserveAspectRatio", "none")
          .attr("xlink:href", normalTextNode);

        svg
          .append("defs")
          .append("marker")
          .attr("id", "positiveMarker")
          .attr("orient", "auto")
          .attr("refX", 2)
          .attr("refY", 7)
          .attr("markerWidth", 13)
          .attr("markerHeight", 13)
          .append("path")
          .attr("d", "M2,2 L2,13 L8,7 L2,2")
          .style("stroke", "#00ffff")
          .style("fill", "#00ffff");

        //节点

        var g_nodes = svg_g
          .append("g")
          .selectAll("g")
          .data(root.nodes)
          .enter()
          .append("g")
          .attr("class", "g_node");

        state.nodes_img = g_nodes
          .append("circle")
          .attr("class", (d) => {
            if (d.flagMark === "true") {
              return "person";
            } else {
              return "circleImg";
            }
          })
          .attr("r", state.radius)
          .attr("stroke-width", 1)
          // .append("pattern")
          // .attr("patternContentUnits","objectBoundingBox")
          // .attr("id","person")
          // .attr("height",20)
          // .attr("width",20)
          // .attr("xlink:href",personTxt)
          .attr("fill", function (d, i) {
            if (d.flagMark === "true") {
              return "yellow";
            }
            if (d.ack) {
              return "#dd3737";
            } else {
              if (d.status == 1) {
                return "#F8F8FF";
              } else if (d.status == 0) {
                return "#00FF7F";
              }
            }
            return "#00ffff";
          })
          .attr("x", function (d) {
            d.x = lineLenth * (d.layer - 1) + marginX;
            return d.x;
          })
          .attr("y", function (d) {
            d.y = marginY + d.priority * lineLenth;
            return d.y;
          })
          .on("mouseenter", function (e, node) {
            d3.select(this)
              .attr("r", 30)
              .attr("fill", function (d, i) {
                if (d.state == 1) {
                  return "url(#error)";
                } else {
                  return "url(#normal)";
                }
              });
          })
          .on("mouseleave", function (e, node) {
            e.stopPropagation();
            d3.select(this)
              .attr("r", state.radius)
              .attr("fill", function (d, i) {
                if (d.flagMark === "true") {
                  return "yellow";
                }
                if (d.ack) {
                  return "#dd3737";
                } else {
                  if (d.status == 1) {
                    return "#F8F8FF";
                  } else if (d.status == 0) {
                    return "#00FF7F";
                  }
                }
                return "#00ffff";
              });
          })
          .on("click", funMethods.descClick);
          
          // .on("click", function () {
          //   d3.select(this).attr("style", "display:none;");
          //   d3.select(this.parentNode)
          //     .select(".nodetext")
          //     .attr("style", "display:none;");
          //   d3.select(this.parentNode)
          //     .select(".g_rect")
          //     .attr("style", "display:block;");
          // });

        var edges_g = svg_g
          .append("g")
          .selectAll("g")
          .data(root.links)
          .enter()
          .append("g")
          .attr("class", "g_link");

        state.edges_line = edges_g
          .append("path")
          .style("stroke", "#00f1f2")
          .style("stroke-dasharray", (d) => {
            if (d.flag === "true") {
              return "5";
            } else {
              return "0";
            }
          })
          .style("stroke-width", 1)
          .attr("d", function (d) {
            var r = state.radius + 4;
            var x1 = d.source.x;
            var y1 = d.source.y;
            var ao = funMethods.getTargetAngle(d);
            var x2 = d.target.x - r * Math.cos((ao * Math.PI) / 180);
            var y2 = d.target.y - r * Math.sin((ao * Math.PI) / 180);
            return "M" + x1 + "," + y1 + " L" + x2 + "," + y2;
          })
          .attr("marker-end", function (d) {
            return "url(#positiveMarker)";
          });
        state.edges_text = edges_g
          .append("text")
          .style("stroke", "#D33139")
          .style("stroke-width", 1)
          .style("text-size", "14px")
          .text(function (d) {
            return d.text;
          });

        state.edges_text
          .attr("x", function (d) {
            var r = state.radius + 4;
            var x1 = d.source.x;
            var y1 = d.source.y;
            var ao = funMethods.getTargetAngle(d);
            var x2 = d.target.x - r * Math.cos((ao * Math.PI) / 180);
            var y2 = d.target.y - r * Math.sin((ao * Math.PI) / 180);
            var x = (x1 + x2) / 2;
            d.x = x;
            return x;
          })
          .attr("y", function (d) {
            var r = state.radius + 4;
            var x1 = d.source.x;
            var y1 = d.source.y;
            var ao = funMethods.getTargetAngle(d);
            var x2 = d.target.x - r * Math.cos((ao * Math.PI) / 180);
            var y2 = d.target.y - r * Math.sin((ao * Math.PI) / 180);
            var y = (y1 + y2) / 2;
            d.y = y;
            return y;
          })
          .attr("transform", function (d) {
            var ao = funMethods.getTargetAngle(d);
            var rect = d3.select(this).node().getBoundingClientRect();
            var dx = d.x;
            var dy = d.y;
            var translateX = -(rect.width / 2);
            var translateY = -(rect.height / 2);
            return (
              "rotate(" +
              ao +
              "," +
              dx +
              "," +
              dy +
              ") translate(" +
              translateX +
              "," +
              translateY +
              ")"
            );
          });

        var rect_g = g_nodes
          .append("g")
          .attr("class", "g_rect")
          .attr("style", "display:none;")
          .on("click", funMethods.descClick)
          // .on("mouseleave", function (e, node) {
          //   e.stopPropagation();
          //   d3.select(this).attr("style", "display:none;");
          //   d3.select(this.parentNode)
          //     .select("circle")
          //     .attr("style", "display:block;");
          //   d3.select(this.parentNode)
          //     .select(".nodetext")
          //     .attr("style", "display:block;");
          // });

        state.rectNode = rect_g
          .append("rect")
          .attr("width", state.img_w)
          .attr("height", state.img_h)
          .attr("fill", function (d) {
            if (d.status == 1) {
              return "url(#error_text)";
            } else {
              return "url(#normal_text)";
            }
          });

        var text_dy = 30;
        var text_dx = 30;
        // 树节点下方的提示名称
        state.nodes_text = g_nodes
          .append("text")
          .attr("class", "nodetext")
          // .attr("text-anchor", "start")
          .attr("stroke", "#fffbdc")
          .attr("font-size", 20);

        var nodes_text_span1 = state.nodes_text
          .append("tspan")
          .attr("dx", 100)
          .attr("dy", 40)
          .text(function (d: any) {
            return d.name + "：" + d.pid;
          });

        // var nodes_text_span3 = _this.nodes_text.append('tspan')
        // .attr("dx",100)
        // .attr("dy","1.2em")
        // .text(function (d) {
        //   return "pid："+d.pid
        // })

        var nodes_text_span4 = state.nodes_text
          .append("tspan")
          .attr("dx", 100)
          .attr("dy", "1.2em")
          .text(function (d) {
            if (d.ack_desc) {
              return "描述：" + d.ack_desc;
            } else {
              return "";
            }
          });

        var nodes_text_span2 = state.nodes_text
          .append("tspan")
          .attr("dy", "1.2em")
          .text(function (d) {
            if (d.ack) {
              if (!d.extra_args) {
                return "";
              }
              return "参数:" + d.extra_args;
            } else {
              return "";
            }
          });
        nodes_text_span1.attr("dx", function (d) {
          var textRect = d3.select(this).node().getBoundingClientRect();
          var dx = -(textRect.width / 2);
          d.node_dx = dx;
          return dx;
        });

        nodes_text_span2.attr("dx", function (d) {
          return d.node_dx * 2;
        });
        // nodes_text_span3
        // .attr("dx",function(d){
        //   return d.node_dx*2
        // })
        nodes_text_span4.attr("dx", function (d) {
          // var dx = (textRect.width/2)
          // d.node_dx = dx
          return d.node_dx * 2;
        });

        state.rect_text = rect_g
          .append("text")
          .attr("class", "rect_text")
          .attr("fill", function (d) {
            if (d.flag === "true") {
              return "pink";
            }
            if (d.ack) {
              return "#DD3737";
            }
            return "#33C7FF";
          })
          .on("click", funMethods.descClick)
          .attr("font-size", 18);

        // 鼠标点击后显示的内容
        state.rect_text
          .append("tspan")
          .attr("dx", 100)
          .attr("dy", 40)
          .text(function (d) {
            return "名称：" + d.name;
          });
        state.ack_text = state.rect_text
          .append("tspan")
          .attr("dx", 100)
          .attr("dy", "1.2em")
          .text(function (d) {
            return "攻击：" + d.ack_desc;
          });

        state.desc_text = state.rect_text
          .append("tspan")
          .attr("dx", 100)
          .attr("dy", "1.2em")
          .attr("style", "cursor:pointer;")
          .text(function (d) {
            if (d.flag == "true") {
              return "";
            }
            return "查看详情";
          })
          .on("click", funMethods.descClick);

        state.nodes_img.attr("cx", function (d) {
          return d.x;
        });
        state.nodes_img.attr("cy", function (d) {
          return d.y;
        });
        var drag = d3
          .drag()
          .on("start", function (e, d) {
            state.handles.push({ eventType: "drag", x: d.x, y: d.y, node: d });
          })
          .on("drag", function (e, d) {
            d.x = e.x;
            d.y = e.y;
            funMethods.drag();
          });
        state.nodes_img.call(drag);

        state.rect_text
          .attr("x", function (d) {
            return d.x - 50;
          })
          .attr("y", function (d) {
            return d.y - state.img_h / 2;
          });
        state.desc_text.attr("x", function (d) {
          return d.x - 50;
        });
        state.ack_text.attr("x", function (d) {
          return d.x - 50;
        });
        state.rectNode.attr("x", function (d) {
          return d.x - 50;
        });
        state.rectNode.attr("y", function (d) {
          return d.y - state.img_h / 2;
        });

        state.nodes_text.attr("x", function (d) {
          return d.x;
        });
        state.nodes_text.attr("y", function (d) {
          return d.y;
        });

        var gRect = d3
          .select("#graph")
          .select("g")
          .node()
          .getBoundingClientRect();

        if (gRect.width < svgRect.width) {
          tranX = (svgRect.width - gRect.width) / 2 - (gRect.x - svgRect.x);
        }
        if (gRect.height < svgRect.height) {
          tranY = (svgRect.height - gRect.height) / 2 - (gRect.y - svgRect.y);
        }

        transform.x = tranX;
        transform.y = tranY;
        svg_g.attr("transform", transform);
      },
      // 划线 连接
      drag() {
        state.nodes_img.attr("cx", function (d) {
          return d.x;
        });
        state.nodes_img.attr("cy", function (d) {
          return d.y;
        });

        state.edges_line.attr("d", function (d) {
          var r = state.radius + 4;
          var x1 = d.source.x;
          var y1 = d.source.y;
          var ao = funMethods.getTargetAngle(d);
          var x2 = d.target.x - r * Math.cos((ao * Math.PI) / 180);
          var y2 = d.target.y - r * Math.sin((ao * Math.PI) / 180);
          return "M" + x1 + "," + y1 + " L" + x2 + "," + y2;
        });
        state.edges_line.attr("marker-end", function (d) {
          return "url(#positiveMarker)";
        });
        state.edges_text
          .attr("x", function (d) {
            var r = state.radius + 4;
            var x1 = d.source.x;
            var y1 = d.source.y;
            var ao = funMethods.getTargetAngle(d);
            var x2 = d.target.x - r * Math.cos((ao * Math.PI) / 180);
            var y2 = d.target.y - r * Math.sin((ao * Math.PI) / 180);
            var x = (x1 + x2) / 2;
            d.x = x;
            return x;
          })
          .attr("y", function (d) {
            var r = state.radius + 4;
            var x1 = d.source.x;
            var y1 = d.source.y;
            var ao = funMethods.getTargetAngle(d);
            var x2 = d.target.x - r * Math.cos((ao * Math.PI) / 180);
            var y2 = d.target.y - r * Math.sin((ao * Math.PI) / 180);
            var y = (y1 + y2) / 2;
            d.y = y;
            return y;
          })
          .attr("transform", function (d) {
            var ao = funMethods.getTargetAngle(d);
            var rect = d3.select(this).node().getBoundingClientRect();
            var dx = d.x;
            var dy = d.y;
            var translateX = -(rect.width / 2);
            var translateY = -(rect.height / 2);
            return (
              "rotate(" +
              ao +
              "," +
              dx +
              "," +
              dy +
              ") translate(" +
              translateX +
              "," +
              translateY +
              ")"
            );
          });
        state.nodes_text.attr("x", function (d) {
          return d.x;
        });
        state.nodes_text.attr("y", function (d) {
          return d.y;
        });

        state.rectNode.attr("x", function (d) {
          return d.x - 50;
        });
        state.rectNode.attr("y", function (d) {
          return d.y - state.img_h / 2;
        });
        state.rect_text
          .attr("x", function (d) {
            return d.x - 50;
          })
          .attr("y", function (d) {
            return d.y - state.img_h / 2;
          });
        state.desc_text.attr("x", function (d) {
          return d.x - 50;
        });
        state.ack_text.attr("x", function (d) {
          return d.x - 50;
        });
      },
      handleKey(event: any) {
        switch (event.keyCode) {
          case 90:
            if (state.handles.length <= 0) return;
            var handle = state.handles.pop();
            handle.node.x = handle.x;
            handle.node.y = handle.y;
            funMethods.drag();
        }
      },
      getTargetAngle(d: any) {
        var ao = 0;
        var a = Math.abs(d.source.x - d.target.x);
        var b = Math.abs(d.source.y - d.target.y);
        var c = Math.sqrt(a * a + b * b);
        var angle = (Math.acos(a / c) * 180) / Math.PI;
        if (d.source.x < d.target.x) {
          if (d.source.y < d.target.y) {
            ao = angle;
          } else if (d.source.y == d.target.y) {
            ao = 0;
          } else {
            ao = -angle;
          }
        } else if (d.source.x == d.target.x) {
          if (d.source.y < d.target.y) {
            ao = 90;
          } else {
            ao = -90;
          }
        } else {
          if (d.source.y < d.target.y) {
            ao = 180 - angle;
          } else if (d.source.y == d.target.y) {
            ao = 180;
          } else {
            ao = -180 + angle;
          }
        }
        return ao;
      },
      getSourceAngle(d: any) {
        var ao = 0;
        var a = Math.abs(d.source.x - d.target.x);
        var b = Math.abs(d.source.y - d.target.y);
        var c = Math.sqrt(a * a + b * b);
        var angle = (Math.cos(a / c) * 180) / Math.PI;
        if (d.source.x < d.target.x) {
          if (d.source.y < d.target.y) {
            ao = -180 + angle;
          } else if (d.source.y == d.target.y) {
            ao = 180;
          } else {
            ao = 180 - angle;
          }
        } else if (d.source.x == d.target.x) {
          if (d.source.y < d.target.y) {
            ao = -90;
          } else {
            ao = 90;
          }
        } else {
          if (d.source.y < d.target.y) {
            ao = -angle;
          } else if (d.source.y == d.target.y) {
            ao = 0;
          } else {
            ao = angle;
          }
        }
        return ao;
      },
      descClick(e: any, node: any) {
        console.log('hhhhhhhhhhhhhhhhhhh');
        
        e.stopPropagation();
        state.dialogFormVisible = true;
        var descData = node.log;
        state.logData = [];
        descData.forEach(function (log) {
          state.logData.push(log);
        });
        console.log(descData);
        
        if (state.logData.length == 0) {
          state.emptytxt = true;
        } else {
          state.emptytxt = false;
        }
        state.logData.map(function (value, index) {
          value.tactics = value.attck.tactics;
          value.techniques = value.attck.techniques;
          value.name = value.attck.rule;
          value.event_type = value.attck.event_type;
          value.behavior_analyse_result = value.behavior_analyse.result;
        });
        state.title = node.name;
        state.total = state.logData.length;
        state.tableData = state.logData.slice(
          (state.currentPage - 1) * state.pageSize,
          state.currentPage * state.pageSize
        );
      },
      handleRepeat(nodes: any) {
        while (true) {
          var repeat1 = null;
          var repeat2 = null;
          try {
            nodes.forEach((d) => {
              repeat1 = d;
              nodes.forEach((dd) => {
                if (
                  d.layer == dd.layer &&
                  d.priority == dd.priority &&
                  d.pid != dd.pid
                ) {
                  repeat2 = dd;
                  throw "repeat";
                }
              });
            });
          } catch (e) {}
          if (!repeat2) {
            break;
          }
          var layer = 0;
          if (repeat1.root.layer <= repeat2.root.layer) {
            layer = repeat1.root.layer;
          } else {
            layer = repeat2.root.layer;
          }
          // nodes.forEach((dd) => {
          //   if (!dd.root) return;
          //   // if (layer == dd.root.layer) {
          //   //   if (dd.priority > 1)
          //   //     //只处理大于1的
          //   //     dd.priority += 1;
          //   //     return;
          //   // }
          // });
        }
      },
      getNodeLayer(roots: any, nodes: any) {
        roots.forEach((d: any) => {
          var tmp = [];
          var priority = 0;
          nodes.forEach((dd: any) => {
            if (d.pid == dd.ppid && dd.pid != dd.ppid) {
              priority++;
              dd.layer = d.layer + 1;
              if (d.ack && dd.ack) {
                dd.priority = d.priority + 1;
              } else {
                if (priority > 1) {
                  dd.priority = d.priority + (priority - 1);
                } else {
                  dd.priority = d.priority;
                }
              }
              if (d.priority == 1) {
                dd.root = d;
              } else {
                dd.root = d.root;
              }
              tmp.push(dd);
            }
          });
          if (tmp.length > 0) {
            funMethods.getNodeLayer(tmp, nodes);
          }
        });
      },
      //树节点信息
      modelData() {
        state.graphData.nodes = [];
        state.graphData.links = [];
        var roots = [];
        var tempObj = JSON.parse(JSON.stringify(state.processData));
        var priority = 1;
        // 调用接口返回的信息  其中nodes数组包含所有的节点信息
        // tempObj中的数据解析  attcks是红色的节点   edges是白色的节点   nodes内包含所有的节点信息
        if (!tempObj.nodes) {
          return;
        }
        tempObj.nodes.sort(function (a, b) {
          var date1: any = new Date(a.stime);
          var date2: any = new Date(b.stime);
          var pre = Date.parse(date1);
          var next = Date.parse(date2);
          if (pre == next) {
            return a.count - b.count;
          }
          return pre - next;
        });

        tempObj.nodes.forEach(async (fatherItem) => {
          fatherItem.ack = false;
          fatherItem.ack_desc = "";
          //已使用的  红色
          tempObj.attcks.forEach((attackItem) => {
            if (fatherItem.pid == attackItem.pid) {
              fatherItem.ack = true;
              fatherItem.ack_desc = attackItem.desc;
            }
          });
          var parent = null;
          // 重新遍历成树  父子节点连接成功
          tempObj.nodes.forEach((nodeItem) => {
            if (
              nodeItem.pid == fatherItem.ppid &&
              fatherItem.pid != fatherItem.ppid
            ) {
              parent = nodeItem;
            }
          });

          var flagNum = 1;
          tempObj.edges.forEach((m) => {
            const newLink1Source = tempObj.nodes.filter(
              (n) => m.source[0] == n.pid
            );
            const newLink2Source = tempObj.nodes.filter(
              (n) => m.target[0] == n.pid
            );
            if (m.target[0] == fatherItem.pid) {
              flagNum++;
              var newItem = {
                ack: true,
                ack_desc: "",
                pid: fatherItem.pid + newLink2Source[0].pid, //自己的id不重要  重要的是父id
                ppid: fatherItem.pid,
                status: 0,
                stime: m.source[1],
                name: m.properties.obj,
                layer: 16 + flagNum + 19, //不知道有啥用
                flagMark: "true",
                priority: 3,
              };
              var newLink1 = {
                source: newLink1Source[0], //连线起点
                target: newItem, //连线终点
                flag: "true",
              };
              var newLink2 = {
                source: newLink2Source[0], //连线起点
                target: newItem, //连线终点
                flag: "true",
              };
              state.graphData.links.push(newLink1); //树型的连线
              state.graphData.links.push(newLink2); //树型的连线
              tempObj.nodes.push(newItem);
            }
          });
          if (parent) {
            var link = {
              source: parent, //连线起点
              target: fatherItem, //连线终点
            };
            state.graphData.links.push(link); //树型的连线
          } else {
            fatherItem.layer = 1;
            fatherItem.priority = priority;
            roots.push(fatherItem);
            priority++;
          }
        });
        // console.log('这是txt数据',tempObj.edges);
        // console.log(
        //   "这是最终的数据",
        //   tempObj.nodes.map((m) => {
        //     return {
        //       ...m,
        //       // pid:m.pid,
        //       // ppid:m.ppid,
        //     };
        //   })
        // );
        // console.log(tempObj.nodes);

        funMethods.getNodeLayer(roots, tempObj.nodes);
        // funMethods.handleRepeat(tempObj.nodes);
        state.graphData.nodes = tempObj.nodes;
      },

      modelData2() {
        state.graphData.nodes = [];
        state.graphData.links = [];
        var tempObj = JSON.parse(JSON.stringify(state.processData));
        var tempNodes = [];
        var sCount = 1;
        var tCount = 1;
        tempObj.edges.forEach((d) => {
          var source = null;
          var target = null;
          tempObj.nodes.forEach((dd) => {
            if (d.source[0] == dd.pid) {
              source = dd;
            }
            if (d.target[0] == dd.pid) {
              target = dd;
            }
          });
          if (source) {
            source.layer = 1;
            source.priority = sCount;
            tempNodes.push(source);
            sCount++;
          }
          if (target) {
            target.layer = 2;
            target.priority = tCount;
            tempNodes.push(target);
            tCount++;
          }
          if (source && target) {
            state.graphData.links.forEach((dd) => {
              if (dd.source.pid == target.pid) {
                source.layer = d.source.layer;
                dd.source.layer = source.layer + 1;
                dd.target.layer = dd.source.layer + 1;
              }
              if (dd.target.pid == source.pid) {
                target.layer == dd.target.layer + 1;
              }
            });
            var link = {
              source: source,
              target: target,
              text: d.properties.obj,
            };
            state.graphData.links.push(link);
          }
        });
        state.graphData.nodes = tempNodes;
      },
      // 进程数节点数据的操作 ===> 攻击模型
      async modelData3() {
        // tmpData 和 attackMatrixData中的  tacticsArr 是表头数据  techniquesArr是表数据
        var tmpData = JSON.parse(JSON.stringify(attackMatrixData)); //表格数据  是死数据
        var tempAttack = JSON.parse(JSON.stringify(state.processData)); //树的节点信息
        state.backHeader = tmpData.tacticsArr; //表头
        state.attackLinks = [];
        state.backData = [];

        // 对比表头和列表的tactics 一致则将children加入到表头下方
        // console.log(tmpData.techniquesArr);
        tmpData.techniquesArr.forEach((a) => {
          a.children.forEach((b) => {
            b.tactics = a.tactics;
            state.backData.push(b);
          });
        });
        // 159个数据添加完毕

        //以上是正确的
        // 如果有红色节点走这里
        if (tempAttack.attcks) {
          // 给红色节点重新排序!!!
          tempAttack.attcks.sort((a, b) => a.count - b.count);

          var cur = null; //起点
          var next = null; //终点
          tempAttack.attcks.forEach(async (attackNode, index) => {
            var attack = false; //是否变红的标志  true是红 false是蓝
            var count = 0; //表示有几个变红的节点

            tempAttack.nodes.forEach((node) => {
              if (attackNode.pid == node.pid) {
                attackNode.number = index + 1;
                attackNode.name = node.name;
                attack = true;
              }
            });

            attackNode.nodes.forEach((pid) => {
              tempAttack.nodes.forEach((node) => {
                if (pid == node.pid) {
                  count++;
                }
              });
            });

            // console.log(attack);
            if (attack && count == attackNode.nodes.length) {
              // console.log(attackNode);
              var i = 0;
              state.backData.forEach((d) => {
                i++;
                // console.log(i);
                if (
                  d.tactics == attackNode.tacticsno &&
                  d.techniques == attackNode.techno
                ) {
                  if (!d.attcks) {
                    d.attcks = [];
                  }
                  d.attcks.push(attackNode);
                  if (!cur) {
                    cur = d;
                  } else {
                    next = d;
                  }
                  if (cur && next) {
                    if (
                      cur.tactics == next.tactics &&
                      cur.techniques == next.techniques
                    ) {
                      // 要是返回的techno一致，则不发生连线，有用
                    } else {
                      state.attackLinks.push({
                        source: cur,
                        target: next,
                      });
                    }
                    cur = d;
                    next = null;
                  }
                }
              });
            }
          });
        }
      },

      // 图表点击后显示的树节点信息
      modelData4(nodesArr) {
        state.graphData.nodes = [];
        state.graphData.links = [];
        var tempObj = JSON.parse(JSON.stringify(state.processData));
        var nodes = [];
        var roots = [];
        var priority = 1;
        nodesArr.forEach((d) => {
          tempObj.nodes.forEach((dd) => {
            if (d == dd.pid) {
              nodes.push(dd);
            }
          });
        });

        nodes.sort(function (a, b) {
          var date1: any = new Date(a.stime);
          var date2: any = new Date(b.stime);
          var pre = Date.parse(date1);
          var next = Date.parse(date2);
          if (pre == next) {
            return a.count - b.count;
          }
          return pre - next;
        });
        nodes.forEach((fatherItem) => {
          tempObj.attcks.forEach((dd) => {
            if (fatherItem.pid == dd.pid) {
              fatherItem.ack = true;
              fatherItem.ack_desc = dd.desc;
            }
          });
          var parent = null;
          nodes.forEach((dd) => {
            if (
              fatherItem.ppid == dd.pid &&
              fatherItem.pid != fatherItem.ppid
            ) {
              parent = dd;
            }
          });
          var flagNum = 1;
          // todo 2024.1.2 新加功能 --- 添加 共同被操作文件 的树节点
          tempObj.edges.forEach((m) => {
            const newLink1Source = tempObj.nodes.filter(
              (n) => m.source[0] == n.pid
            );
            const newLink2Source = tempObj.nodes.filter(
              (n) => m.target[0] == n.pid
            );
            if (m.target[0] == fatherItem.pid) {
              flagNum++;
              var newItem = {
                ack: true,
                ack_desc: "",
                pid: fatherItem.pid + newLink2Source[0].pid, //自己的id不重要  重要的是父id
                ppid: fatherItem.pid,
                status: 0,
                stime: m.source[1],
                name: m.properties.obj,
                layer: 16 + flagNum, //不知道有啥用
                flagMark: "true",
              };
              var newLink1 = {
                source: newLink1Source[0], //连线起点
                target: newItem, //连线终点
                flag: "true",
              };
              var newLink2 = {
                source: newLink2Source[0], //连线起点
                target: newItem, //连线终点
                flag: "true",
              };
              state.graphData.links.push(newLink1); //树型的连线
              state.graphData.links.push(newLink2); //树型的连线
              tempObj.nodes.push(newItem);
            }
          });

          if (parent) {
            var link = {
              source: parent, //连线起点
              target: fatherItem, //连线终点
            };
            state.graphData.links.push(link); //树型的连线
          } else {
            fatherItem.layer = 1;
            fatherItem.priority = priority;
            roots.push(fatherItem);
            priority++;
          }
        });
        funMethods.getNodeLayer(roots, nodes);
        funMethods.handleRepeat(nodes);
        state.graphData.nodes = nodes;
      },

      // 初始化图表
      initTable(openLook?: any) {
        // (document.getElementById("particles") as any).style.zIndex = -100;
        let treeContainer = document.getElementById("tree");
        // 确保 treeContainer 有滚动条
        let newDiv = document.getElementById("treeinfo");

        // 滚动 treeContainer 而不是整个文档
        var width = treeContainer.clientWidth * 1.5;
        var height = treeContainer.clientHeight * 1.2;

        if (isNull(state.processData)) {
          return;
        }
        var drag = d3
          .drag()
          .on("start", function (event) {
            if (!event.active) event.sourceEvent.preventDefault();
            d3.select(this).raise().classed("dragging", true);
          })
          .on("drag", function (event) {
            d3.select(this).attr(
              "transform",
              "translate(" + event.x + "," + event.y + ")"
            );
          })
          .on("end", function (event) {
            d3.select(this).classed("dragging", false);
          });

        var svg = d3
          .select("#tree")
          .append("svg")
          .attr("id", "table")
          .attr("width", width)
          .attr("height", height);

        var svg_g = svg
          .append("g")
          .attr("transform", "translate(0,0) scale(1)")
          // .call(drag);

        var scale = 1;
        var tranX = 0;
        var tranY = 0;
        var transform = d3.zoomTransform(d3.select("svg"));
        transform.x = tranX;
        transform.y = tranY;
        // var zoom = d3
        //   .zoom()
        //   .scaleExtent([0.1, 10])
        //   .on("start", () => {
        //     svg_g.attr("cursor", "pointer");
        //   })
        //   .on("zoom", function (event) {
        //     // 监听缩放事件 event是拿到的dom元素
        //     transform = d3.zoomTransform(this);
        //   });
        // // 调用
        // svg.call(zoom).call(zoom.transform, d3.zoomIdentity.scale(0.86));
        svg_g.attr("transform", transform);
        var headerRow = svg_g
          .append("g")
          .selectAll("g")
          .data(state.backHeader)
          .enter()
          .append("g");

        svg
          .append("defs")
          .append("marker")
          .attr("id", "positiveMarker")
          // .attr('id','resolved')
          .attr("orient", "auto")
          .attr("refX", 6)
          .attr("refY", 4)
          .attr("markerWidth", 16)
          .attr("markerHeight", 16)
          .append("path")
          .attr("d", "M2,2 L2,6 L6,4 L2,2")
          .style("stroke", "#D33139")
          .style("stroke-width", 1)
          .style("fill", "#D33139");

        var minRectWidth = 245;
        var rectWidth = minRectWidth;
        var rectHeight = 70;
        var initX = 100; // 初始X坐标
        var initY = 20; //初始Y坐标
        var dataToHeaderTop = 10;
        var titlePadTop = 30;
        var totalPadTop = 50;
        var marginLeft = 10;

        headerRow
          .append("rect")
          .attr("width", rectWidth) //表头宽度
          .attr("height", rectHeight) //表头高度
          .attr("x", function (d) {
            d.x = (d.index - 1) * (rectWidth + marginLeft) + initX;
            return d.x;
          })
          .attr("y", function (d) {
            d.y = initY;
            return d.y;
          })
          .style("fill", "#022c56"); //表头的颜色填充

        headerRow
          .append("text")
          .attr("font-size", 24)
          .attr("width", rectWidth)
          .attr("x", function (d) {
            return d.x + rectWidth / 2;
          })
          .attr("y", function (d) {
            return d.y + titlePadTop;
          })
          .text(function (d) {
            return d.desc;
          })
          .style("fill", "#2e95f6")
          .style("dominant-baseline", "middle")
          .style("text-anchor", "middle");

        headerRow.append("title").text(function (d) {
          return d.tactics;
        });
        headerRow
          .append("text")
          .attr("width", rectWidth)
          .attr("x", function (d) {
            return d.x + rectWidth / 2;
          })
          .attr("y", function (d) {
            return d.y + totalPadTop;
          })
          .text(function (d) {
            var childCount = 0;
            attackMatrixData.techniquesArr.forEach((techniques) => {
              if (techniques.tactics == d.tactics) {
                childCount = techniques.children.length;
              }
            });
            return childCount + " techniques";
          })
          .style("fill", "#d9d9d9")
          .style("dominant-baseline", "middle")
          .style("text-anchor", "middle");

        // 以上是表头配置参数
        // svg_g
        //   .append("line")
        //   .attr("class", "horizontal")
        //   .attr("x1", function (d) {
        //     return 100;
        //   })
        //   .attr("x2", function (d) {
        //     var rect = d3
        //       .select("#table")
        //       .select("g")
        //       .node()
        //       .getBoundingClientRect();
        //     return rect.width + 348;
        //   })
        //   .attr("y1", function (d) {
        //     return initY + rectHeight + dataToHeaderTop / 2;
        //   })
        //   .attr("y2", function (d) {
        //     return initY + rectHeight + dataToHeaderTop / 2;
        //   })
        //   .style("stroke-width", 2)
        //   .style("stroke", "#d9d9d9");

        // 以上是线的参数配置

        var dataRow = svg_g
          .append("g")
          .selectAll("g")
          .data(state.backData)
          // .call(drag)
          .enter()
          .append("g");

        dataRow.append("title").text(function (d) {
          return d.techniques;
        });

        dataRow
          .append("rect")
          .attr("width", function (d) {
            d.width = rectWidth;
            return d.width;
          })
          .style("stroke", "#a9bad7") //表体的边框颜色
          .style("stroke-width", 1)
          .attr("rx", 16)
          .attr("ry", 16)
          .attr("x", function (d) {
            var x = 0;
            state.backHeader.forEach((tactics) => {
              if (tactics.tactics == d.tactics) {
                x = tactics.x;
              }
            });
            d.x = x;
            return d.x;
          })
          .attr("y", function (d) {
            d.y = initY + rectHeight * d.index + dataToHeaderTop;
            return d.y + 100;
          });
        // 添加表体内容
        if (openLook) {
          // 点击播放按钮后的显示表体内容
          dataRow
            .append("foreignObject")
            .attr("x", (d) => d.x)
            .attr("width", rectWidth)
            .append("xhtml:body")
            .append("div")
            .style("stroke", "#a9bad7")
            .attr("class", (d) => {
              if (d.attcks) {
                return "table_attacks_text";
              } else {
                return "table_text";
              }
            })
            // .attr('fill','red')
            .text((d) => d.desc)
            // 图表的点击事件
            .on("click", (e: any, d: any) => {
              funMethods.resetBtn();
              var svgRect = d3.select("#table").node().getBoundingClientRect();
              var attcks = d.attcks;
              var nodesArr = null;
              if (attcks.length > 1) {
                var left = e.x;
                var top = e.y - svgRect.top;
                document.getElementById("record").style.left = left + "px";
                document.getElementById("record").style.top = top + "px";
                document.getElementById("record").style.display = "block";
                state.curTechAttcks = attcks;
                return;
              } else if (attcks.length == 1) {
                nodesArr = attcks[0].nodes;
              }
              if (!nodesArr) return;
              funMethods.handleClick(nodesArr, d.edges);
            });
        } else {
          dataRow
            .append("foreignObject")
            .attr("x", (d) => d.x)
            .attr("width", rectWidth)
            .append("xhtml:body")
            .append("div")
            .attr("class", (d) => {
              if (d.attcks) {
                return "table_attacks_text";
              } else {
                return "table_text";
              }
            })
            // .attr("style","border-radius:10px")
            .text((d) => d.desc)
            // 图表的点击事件
            .on("click", (e, d) => {
              funMethods.resetBtn();
              var svgRect = d3.select("#table").node().getBoundingClientRect();
              var attcks = d.attcks;
              var nodesArr = null;
              if (attcks.length > 1) {
                var left = e.x;
                var top = e.y - svgRect.top;
                document.getElementById("record").style.left = left + "px";
                document.getElementById("record").style.top = top + "px";
                document.getElementById("record").style.display = "block";
                state.curTechAttcks = attcks;
                return;
              } else if (attcks.length == 1) {
                nodesArr = attcks[0].nodes;
              }
              if (!nodesArr) return;
              funMethods.handleClick(nodesArr, d.edges);
            });
          newDiv.scrollLeft = 300;
        }

        dataRow.selectAll("foreignObject").each(function (d) {
          var rect = d3
            .select(this)
            .select("body")
            .select("div")
            .node()
            .getBoundingClientRect();
          d.height = rect.height;
          d3.select(this).attr("height", rect.height);
        });

        var temp = funMethods.backDataGroup();
        if (openLook) {
          dataRow
            .selectAll("rect")
            .attr("height", (d: any) => d.height)
            .attr("y", function (d) {
              var y = initY + dataToHeaderTop + rectHeight;
              temp[d.tactics].forEach((dd) => {
                if (dd.index < d.index) {
                  y = y + dd.height + 8;
                }
              });
              d.y = y;
              return y;
            })
            // .style("fill", "#050c26")
            .attr("fill", function (d, i) {
              return d.index % 2 == 0 ? "#aebdda" : "#95acce";
            })
            .transition()
            // 气泡框的循环出现
            .delay(function (d, i) {
              if (d.attcks) {
                d.attcks.forEach((attack, index) => {
                  var left = d.x + (rectWidth / 2 + 20);
                  var top = d.y - (rectHeight / 2 + 30);
                  setTimeout(() => {
                    var newDiv = document.createElement("div");
                    newDiv.id = "newFloatDiv" + attack.number;
                    newDiv.className = "qipao";
                    newDiv.innerText = attack.desc;
                    newDiv.style.position = "absolute";
                    newDiv.style.display = "flex";
                    newDiv.style.alignItems = "center";
                    newDiv.style.justifyContent = "center";
                    newDiv.style.left = left + "px";
                    newDiv.style.top = top + "px";
                    document.getElementById("tree").appendChild(newDiv);

                    var newDiv1 = document.createElement("div");
                    newDiv1.id = "demo" + attack.number;
                    newDiv1.className = "demo";
                    newDiv1.style.position = "absolute";
                    newDiv1.style.display = "block";
                    newDiv1.style.left = left + "px";
                    newDiv1.style.top = top + 140 + "px";
                    document.getElementById("tree").appendChild(newDiv1);
                  }, 1000 * attack.number);
                });
              } else {
                return 900 * 1;
              }
            })
            .duration(500)
            .attr("fill", function (d, i) {
              return d.index % 2 == 0 ? "#aebdda" : "#95acce";
            });
        } else {
          dataRow
            .selectAll("rect")
            .attr("height", (d: any) => d.height)
            .attr("y", function (d) {
              var y = initY + dataToHeaderTop + rectHeight;
              temp[d.tactics].forEach((dd: any) => {
                if (dd.index < d.index) {
                  y = y + dd.height + 8;
                }
              });
              d.y = y;
              return y;
            })
            .attr("fill", function (d, i) {
              return d.index % 2 == 0 ? "#aebdda" : "#95acce";
              // if (d.attcks) {
              //   return "#050c26";
              // } else {
              //   return "#050c26";
              // }
            });
        }

        dataRow.selectAll("foreignObject").attr("y", function (d) {
          return d.y;
        });

        // 连线
        var gPath = svg_g
          .append("g")
          .selectAll("g")
          .data(state.attackLinks)
          .enter()
          .append("g");
        //2024.1.11 这是添加的延迟连线
        if (openLook) {
          gPath
            .append("path")
            .attr("stroke-width", 0)
            .attr("opacity", 0)
            .transition()
            .delay((d, i) => 1000 * i)
            .duration(2000)
            .attr("opacity", 1)
            .attr("stroke-width", 5)
            .style("stroke", "#D33139")
            .attr("marker-end", function (d) {
              return "url(#positiveMarker)";
            })
            .attr("d", function (d) {
              var source = funMethods.getSourcePoint(d);
              var target = funMethods.getTargetPoint(d);
              var x1 = source.x;
              var y1 = source.y;
              var x2 = target.x;
              var y2 = target.y;
              return "M" + x1 + "," + y1 + " L" + x2 + "," + y2;
            });
        } else {
          gPath
            .append("path")
            .attr("opacity", 1)
            .attr("stroke-width", 5)
            .style("stroke", "#D33139")
            .attr("marker-end", "url(#positiveMarker)")
            .attr("d", function (d) {
              var source = funMethods.getSourcePoint(d);
              var target = funMethods.getTargetPoint(d);
              var x1 = source.x;
              var y1 = source.y;
              var x2 = target.x;
              var y2 = target.y;
              return "M" + x1 + "," + y1 + " L" + x2 + "," + y2;
            });
        }
      },

      hideRecord(e) {
        e.stopPropagation();
        document.getElementById("record").style.display = "none";
      },
      handleItem(item) {
        funMethods.handleClick(item.nodes);
      },
      handleClick(nodesArr: any, edges?: any) {
        document.getElementById("record").style.display = "none";
        funMethods.modelData4(nodesArr);
        funMethods.hideTable();
        funMethods.initGraph();
        state.modelDisabled = true;
        state.snapDisabled = true;
      },
      backDataGroup() {
        var group = {};
        state.backData.forEach((d) => {
          if (!group.hasOwnProperty(d.tactics)) {
            group[d.tactics] = [];
          }
          group[d.tactics].push(d);
        });
        return group;
      },
      getTargetPoint(d) {
        var point = { x: 0, y: 0 };
        if (d.source.x < d.target.x) {
          point.x = d.target.x;
          point.y = d.target.y + d.target.height / 2;
        } else if (d.source.x == d.target.x) {
          if (d.source.y < d.target.y) {
            point.x = d.target.x + d.target.width / 2;
            point.y = d.target.y;
          } else {
            point.x = d.target.x + d.target.width / 2;
            point.y = d.target.y + d.target.height;
          }
        } else {
          point.x = d.target.x + d.target.width;
          point.y = d.target.y + d.target.height / 2;
        }
        return point;
      },
      getSourcePoint(d) {
        var point = { x: 0, y: 0 };
        if (d.source.x < d.target.x) {
          point.x = d.source.x + d.source.width;
          point.y = d.source.y + d.source.height / 2;
        } else if (d.source.x == d.target.x) {
          point.x = d.source.x + d.source.width / 2;
          if (d.source.y < d.target.y) {
            point.y = d.source.y + d.source.height;
          } else {
            point.y = d.source.y;
          }
        } else {
          point.x = d.source.x;
          point.y = d.source.y + d.source.height / 2;
        }
        return point;
      },
      rotate(d) {
        var ao = 0;
        var source = funMethods.getSourcePoint(d);
        var target = funMethods.getTargetPoint(d);
        var a = Math.abs(source.x - target.x);
        var b = Math.abs(source.y - target.y);
        var c = Math.sqrt(a * a + b * b);
        var c = Math.sqrt(a * a + b * b);
        var angle = (Math.acos(a / c) * 180) / Math.PI;
        if (source.x < target.x) {
          if (source.y < target.y) {
            ao = angle;
          } else if (source.y == target.y) {
            ao = 0;
          } else {
            ao = -angle;
          }
        } else if (source.x == target.x) {
          if (source.y < target.y) {
            ao = 90;
          } else {
            ao = -90;
          }
        } else {
          if (source.y < target.y) {
            ao = -angle;
          } else if (source.y == target.y) {
            ao = 0;
          } else {
            ao = angle;
          }
        }
        return ao;
      },
      hideTable() {
        state.showBack = true;
        d3.select("#tree").select("#table").attr("display", "none");
      },
      back() {
        state.showBack = false;
        state.modelDisabled = false;
        state.snapDisabled = false;
        d3.select("#tree").select("#graph").remove();
        d3.select("#tree").select("#table").attr("display", "");
      },
      getNowDate() {
        const now = new Date();
        const firstTime = moment(now).format("YYYY-MM-DD HH:mm:ss");
        const lastTime = moment(firstTime)
          .subtract(5, "minute")
          .format("YYYY-MM-DD HH:mm:ss");
        state.timeRangeValue = [lastTime, firstTime];
      },
    };

    onMounted(() => {
      window.addEventListener("keydown", funMethods.handleKey);
      funMethods.getNowDate();
      // particlesJS("particles",this.cavasOptions)
      funMethods.node2Tree();
      funMethods.changeModel(3);

      state.nodeTreedata = [
        {
          label: "Level one 1",
          children: [
            {
              label: "Level two 1-1",
              children: [{ label: "Level three 1-1-1" }],
            },
          ],
        },
      ];

      state.nodeTreedata = [...state.nodeTreedata];
    });
    onBeforeUnmount(() => {
      funMethods.resetBtn();
    });
    return {
      ...toRefs(state),
      ...funMethods,
    };
  },
};
</script>
<style>
.node-item {
  color: #fff;
  padding-left: 30px;
  height: 40px;
  line-height: 40px;
  background-color: #031838;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-right: 10px;
}
.node-item:hover {
  color: #118cfe;
  cursor: pointer;
  background-color: #2c4672;
}

.node-select {
  color: #118cfe;
  background-color: #2c4672;
  border-radius: 4px;
}

:deep(.el-scrollbar) {
  background-color: #fff !important;
}

/* :deep(.el-table td.el-table__cell){
  border-bottom: 1px solid red;
} */
</style>

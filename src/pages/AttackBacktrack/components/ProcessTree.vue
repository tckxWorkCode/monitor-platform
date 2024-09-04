<template>
  <div>
    <div id="graph" ></div>
    <el-dialog
      id="descDialog"
      class="zhuxiao"
      :title="title"
      width="40%"
      style="height: 44vh;"
      v-model="dialogFormVisible"
      @close="dialogFormVisible = false"
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
  </div>
</template>

<script lang="ts">
import { reactive, toRefs } from "vue";
import * as d3 from "d3";
import domtoimage from "dom-to-image";
import '../index.scss';

export default {
  name: "ProcessTree",
  setup() {
    const state = reactive({
      dialogFormVisible: false,
      currentPage: 1,
      pageSize: 10,
      logData: [],
      tableData: [],
      dataText: "",
      emptytxt: false,
      total: 0,
      nodeId:'',
      snapSelect: "",
      title: "",
      graphData: {
        nodes: [],
        links: [],
      },
      snapData:[],
      processData: {},
      nodes_img: null,
      nodes_text: null,
      rectNode: null,
      rect_text: null,
      desc_text: null,
      edges_line: null,
      edges_text:null,  
      ack_text:null,
      handles: [],
      radius:16,
      img_h: 100,
      img_w: 280,
    });
    const funMethods = {
      // 导出进程树图片
      importImgFun() {
        var svgElement = document.querySelector("#graph");
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
      modelData(processData) {
        state.graphData.nodes = [];
        state.graphData.links = [];
        var roots = [];
        var tempObj = JSON.parse(JSON.stringify(processData));
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
      initGraph() {
        let treeContainer:any = document.getElementById("graph");
        var width = treeContainer.clientWidth;
        var height = treeContainer.clientHeight;

        var svg = d3
          .select("#graph")
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
        var svgRect = (d3.select("#graph").node() as any).getBoundingClientRect();
        var normalNode = require("@/assets/attackbacktrack/status_normal.png");
        var errorNode = require("@/assets/attackbacktrack/status_error.png");
        var personTxt = require("@/assets/attackbacktrack/no.png");
        var normalTextNode = require("@/assets/attackbacktrack/normal.png");
        var errorTextNode = require("@/assets/attackbacktrack/error.png");
        var maxLayer = Math.max(
          ...root.nodes.map((node:any) => {
            return node.layer;
          })
        );
        var minLayer = Math.min(
          ...root.nodes.map((node:any) => {
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
          .attr("refX", 6)
          .attr("refY", 7)
          .attr("markerWidth", 13)
          .attr("markerHeight", 13)
          .append("path")
          .attr("d", "M2,2 L2,13 L8,7 L2,2")
          .style("stroke", "#00ffff")
          .style("fill", "#00ffff");

        //节点

        var g_nodes:any = svg_g
          .append("g")
          .selectAll("g")
          .data(root.nodes)
          .enter()
          .append("g")
          .attr("class", "g_node");

        state.nodes_img = g_nodes
          .append("circle")
          .attr("class", (d:any) => {
            if (d.flagMark === "true") {
              return "person";
            } else {
              return "circleImg";
            }
          })
          .attr("r", state.radius)
          .attr("stroke-width", 1)
          .attr("fill", function (d:any, i) {
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
          .attr("x", function (d:any) {
            d.x = lineLenth * (d.layer - 1) + marginX;
            return d.x;
          })
          .attr("y", function (d:any) {
            d.y = marginY + d.priority * lineLenth;
            return d.y;
          })
          .on("mouseenter", function (e, node) {
            d3.select(this)
              .attr("r", 30)
              .attr("fill", function (d:any, i) {
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
              .attr("fill", function (d:any, i) {
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

        var edges_g:any = svg_g
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

            if(d.source.x<d.target.x){
              x1=x1+15;
              y1=d.source.y;
            }
            if(d.source.y<d.target.y){
              x1=d.source.x
              y1=y1+15;
            }
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
          .attr("text-anchor", "start")
          .attr("stroke", "#fffbdc")
          .attr("font-size", 20);

        var nodes_text_span1 = state.nodes_text
          .append("tspan")
          .attr("dx", 100)
          .attr("dy", 40)
          .text(function (d: any) {
            return d.name + ":" + d.pid;
          });


        var nodes_text_span4 = state.nodes_text
          .append("tspan")
          .attr("dy", "1.3em")
          .text(function (d) {
            if (d.ack_desc) {
              var truncatedDesc = d.ack_desc.slice(0, 15).trim() + (d.ack_desc.length > 15 ? '...' : '');
              return "描述:" + d.ack_desc;
            } else {
              return "";
            }
          });
        // var nodes_text_span2 = state.nodes_text
        //   .append("tspan")
        //   .attr("dy", "1.2em")  
        //   .text(function (d) {
        //     if (d.ack) {
        //       if (!d.extra_args) {
        //         return "";
        //       }
        //       return "参数:" + d.extra_args;
        //     } else {
        //       return "";
        //     }
        //   });
          
        nodes_text_span1.attr("dx", function (d) {
          var textRect = d3.select(this).node().getBoundingClientRect();
          var dx = -(textRect.width / 2);
          d.node_dx = dx;
          return dx;
        });

        // nodes_text_span2.attr("dx", function (d) {
        //   return d.node_dx * 2;
        // });
        // nodes_text_span3
        // .attr("dx",function(d){
        //   return d.node_dx*2
        // })
        nodes_text_span4.attr("dx", function (d) {
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
      descClick(e: any, node: any) {
        
        e.stopPropagation();
        state.dialogFormVisible = true;
        var descData = node.log;
        state.logData = [];
        descData.forEach(function (log) {
          state.logData.push(log);
        });
        // console.log(descData);
        
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
      refresh() {
        state.handles = [];
        d3.select("#graph").select("svg").remove();
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
#graph{
  height: 87vh;
}
</style>

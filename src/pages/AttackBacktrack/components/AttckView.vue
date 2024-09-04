<template>
  <div class="attckView" id="attckViewTop">
    <div id="attckView" :style="`z-index:${ifShowProcess ? '100' : '-100'}`" ></div>
    <ProcessTree ref="processRef" :style="`z-index:${ifShowProcess ? '-100' : '100'};position:${ ifShowProcess ? 'relative' : 'absolute' }`" />
    <div id="record" @mouseleave="hideRecord">
      <div v-for="item in curTechAttcks" @click="handleItem(item)">
        <div class="record_item">{{ item.record_time }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, toRefs } from "vue";
import * as d3 from "d3";
import { isNull } from "@/utils";
import attackMatrixData from "@/utils/titleData";
import "../index.scss";
import ProcessTree from "./ProcessTree.vue";

export default {
  name: "AttckView",
  components: { ProcessTree },
  emits: ["changeAttckProcess"],
  setup(props, { emit }) {
    const state = reactive({
      processRef: null, //进程树ref
      ifShowProcess: true, // 用来判断attck和进程树的优先级
      attackLinks: [],
      curTechAttcks: [],
      processData: {},
      backHeader: null,
      attackMatrixData,
      backData: [],
      graphData: {
        nodes: [],
        links: [],
      },
      timer:null,
    });
    const funMethods = {
      resetBtn() {
        clearTimeout(state.timer)
        for (var i = 1; i < 50; i++) {
          const a1 = document.getElementById(`newFloatDiv${i}`);
          const a2 = document.getElementById(`demo${i}`);
          // console.log(a1, a2);

          if (a1 || a2) {
            a1.parentNode.removeChild(a1);
            a2.parentNode.removeChild(a2);
          } else {
            return;
          }
        }
      },
      handleItem(item) {
        funMethods.handleClick(item.nodes);
      },
      hideRecord(e) {
        e.stopPropagation();
        document.getElementById("record").style.display = "none";
      },
      changeStatue() {
        state.ifShowProcess = true;
      },
      // attck节点点击事件
      handleClick(nodesArr: any, edges?: any) {
        emit("changeAttckProcess");
        // document.getElementById("record").style.display = "none";
        state.ifShowProcess = false;
        funMethods.modelData4(nodesArr);
        funMethods.hideTable();
        state.processRef.refresh();
        state.processRef.modelData(state.processData);
        state.processRef.initGraph();
        // funMethods.initGraph();
        // state.modelDisabled = true;
        // state.snapDisabled = true;
      },
      initTable(openLook?: any) {
        funMethods.refresh();
        // (document.getElementById("particles") as any).style.zIndex = -100;
        let treeContainer: any = document.getElementById("attckView");
        // 确保 treeContainer 有滚动条
        let newDiv = document.getElementById("attckViewTop");

        // 滚动 treeContainer 而不是整个文档
        var width = treeContainer.clientWidth * 1.5;
        var height = treeContainer.clientHeight * 1.2;

        if (isNull(state.processData)) {
          return;
        }
        // var drag = d3
        //   .drag()
        //   .on("start", function (event) {
        //     if (!event.active) event.sourceEvent.preventDefault();
        //     d3.select(this).raise().classed("dragging", true);
        //   })
        //   .on("drag", function (event) {
        //     d3.select(this).attr(
        //       "transform",
        //       "translate(" + event.x + "," + event.y + ")"
        //     );
        //   })
        //   .on("end", function (event) {
        //     d3.select(this).classed("dragging", false);
        //   });

        var svg = d3
          .select("#attckView")
          .append("svg")
          .attr("id", "table")
          .attr("width", width)
          .attr("height", height);

        var svg_g = svg
          .append("g")
          .attr("transform", "translate(0,0) scale(1)");
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
          newDiv.scrollLeft = 500;
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
                 state.timer= setTimeout(() => {
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
                    document.getElementById("attckView").appendChild(newDiv);

                    var newDiv1 = document.createElement("div");
                    newDiv1.id = "demo" + attack.number;
                    newDiv1.className = "demo";
                    newDiv1.style.position = "absolute";
                    newDiv1.style.display = "block";
                    newDiv1.style.left = left + "px";
                    newDiv1.style.top = top + 140 + "px";
                    document.getElementById("attckView").appendChild(newDiv1);
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
        //2024.1.11 添加延迟连线
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
      // 进程数节点数据的操作 ===> 攻击模型
      async modelData3(processData) {
        state.processData = processData;
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
      hideTable() {
        // state.showBack = true;
        d3.select("#attckView").select("#table").attr("display", "none");
      },
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
      refresh() {
        d3.select("#attckView").select("svg").remove();
      },
      // 播放事件
      openLookFun() {
        let newDiv = document.getElementById("attckViewTop");
        funMethods.resetBtn();
        funMethods.modelData3(state.processData);
        funMethods.refresh();

        funMethods.initTable("openLook");
        newDiv.scrollLeft = 500;
      },
    };
    const requestMethods = {};

    // onMounted(() => {
    //   funMethods.resetBtn();
    //   funMethods.refresh();
    //   funMethods.initTable();
    //   state.ifShowProcess = true;
    // });

    return {
      ...toRefs(state),
      ...funMethods,
      ...requestMethods,
    };
  },
};
</script>

<style lang="scss" scoped>
.attckView {
  position: relative;
  height: 88.5vh;
  width: calc(100vw - 300px);
  overflow: auto;
}

#attckView {
  position: absolute;
  height: 100vh;
  width: 90vw;
}
</style>

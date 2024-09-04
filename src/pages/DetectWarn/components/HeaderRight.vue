<template>
  <div class="header-left">
    <div class="content-title">实时关联预警统计</div>
    <div id="rightEcharts" style="width: 100%; height: 90%"></div>
  </div>
</template>

<script lang="ts">
import { markRaw, onMounted, reactive, toRefs } from "vue";
import detectApi from "@/api/bigScreen/index";
import * as echarts from "echarts";
import { newDataEnum } from "@/utils/enum";

export default {
  name: "HeaderLeft",
  setup() {
    const state = reactive({
      charts1: null,
      newDataEnum,
      xData: [],
      yData: [],
      colorEnum:{
        严重告警:'#FF0000',
        高级告警:'#FF9900',
        中级告警:'#FFFF00',
        低级告警:'#00FF00',
      },
    });
    const funMethods = {
      // 初始化折线图参数配置
      initLeftCharts() {
        state.charts1 = markRaw(
          echarts.init(document.getElementById("rightEcharts") as any)
        );
        state.charts1.setOption(
          {
            color: ["#1370fb"],
            xAxis: {
              type: "category",
              data: state.xData,
              axisLabel: {
                formatter: function (value, index) {
                  var styleMap = {
                    '严重告警': "style1",
                    '高级告警': "style2",
                    '中级告警': "style3",
                    '低级告警': "style4",
                  };
                  var styleName = styleMap[value] || "defaultStyle";
                  return "{" + styleName + "|" + value + "}";
                },
                rich: {
                  style1: { color: "#FF0000", fontSize: 16, },
                  style2: { color: "#FF9900", fontSize: 16, },
                  style3: { color: "#FFFF00", fontSize: 16, },
                  style4: { color: "#00FF00", fontSize: 16, },
                  defaultStyle: { color: "#fff", fontSize: 16, },
                },
              },
            },
            tooltip: {
              trigger: "item",
            },
            toolbox: {
              feature: {
                saveAsImage: {},
              },
            },
            yAxis: {
              type: "value",
              axisLabel: {
                color: "#c8c8c8",
                fontSize: 16,
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: ["#062641"],
                },
              },
            },
            series: [
              {
                data: state.yData,
                type: "bar",
                barWidth: "10%",
                smooth: true,
                lineStyle: {
                  color: "#1370fb",
                },
                itemStyle:{
                  color:(value,index)=>{
                    const name = value.name
                    return state.colorEnum[name]
                  }
                }
              },
            ],
          },
          true
        );
        window.onresize = function () {
          state.charts1.resize();
        };
      },
    };
    const requestMethods = {
      // todo 右侧折线图的接口
      async getLineListChartFun(payload: any) {
        const res: any = await detectApi.sysCall(payload, () => {});
        state.yData = res.map((m: any) => m.count);
        state.xData = res.map((m: any) => newDataEnum[m.name]);
        funMethods.initLeftCharts();
      },
    };
    onMounted(() => {
      //   const newDate = new Date();
      //   console.log(newDate.getTime().toString().format('yyyy-MM-dd'));
      // requestMethods.getLineListFun({});
      const getHomeIp = sessionStorage.getItem("toSysIp");
      if (!getHomeIp) {
        requestMethods.getLineListChartFun({});
      }
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
.header-left {
  height: 100%;
  .content-title {
    margin-top: 20px;
    margin-left: 20px;
    line-height: 20px;
    height: 20px;
    display: flex;
    font-size: 18px;
    &::before {
      content: "";
      display: inline-block;
      width: 4px;
      height: 20px;
      background: linear-gradient(to bottom, #0bcc9b 30%, #0248d1 70%);
      transition: background-image 5s;
      margin-right: 10px;
    }
  }
}
</style>

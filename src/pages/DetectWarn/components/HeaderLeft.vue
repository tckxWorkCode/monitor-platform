<template>
  <div class="header-left">
    <div class="content-title">实时关联预警趋势</div>
    <div id="leftEcharts" style="width: 100%; height: 90%"></div>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, toRefs } from "vue";
import detectApi from "@/api/bigScreen/index";
import * as echarts from "echarts";
import {markRaw} from 'vue';
import "../index.scss";

export default {
  name: "HeaderLeft",
  setup() {
    const state = reactive({
      charts1: null,
      xData: [],
      yData: [],
    });
    const funMethods = {
      // 初始化折线图参数配置
      initLeftCharts() {
        state.charts1 = markRaw(echarts.init(
          document.getElementById("leftEcharts") as any
        ));
        state.charts1.setOption(
          {
            xAxis: {
              type: "category",
              data: state.xData,
              axisLabel: {
                textStyle: {
                  color: "#fff",
                  fontSize:16
                },
              },
            },
            tooltip: {
              trigger: "item",
            },
            yAxis: {
              type: "value",
              axisLabel: {
                color: "#c8c8c8",
                fontSize:16
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
                type: "line",
                axisLabel: {
                  color: "#c8c8c8",
                },
                smooth: true,
                lineStyle: {
                  color: "#1370fb",
                },
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
      // todo 左侧折线图的接口
      async getLineListChartFun(payload:any) {
        const res: any = await detectApi.waringAnalyzeA(payload, () => {});
        state.yData = res.map((m: any) => m.count);
        state.xData = res.map((m: any) => m.name);
        funMethods.initLeftCharts();
      },
    };
    onMounted(() => {
      //   const newDate = new Date();
      //   console.log(newDate.getTime().toString().format('yyyy-MM-dd'));
      const getHomeIp = sessionStorage.getItem('toSysIp');
      if(!getHomeIp){
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

<template>
  <div class="warn-trend">
    <div class="title">
      <dv-decoration-2
        :reverse="true"
        style="width: 10px; height: 20px"
      />告警趋势
    </div>
    <div style="display: flex; flex-direction: row; justify-content: center">
      <el-radio-group v-model="radio" @change="changeRadioFun">
        <el-radio :label="1">年</el-radio>
        <el-radio :label="2">月</el-radio>
        <el-radio :label="3">日</el-radio>
        <el-radio :label="4">周</el-radio>
      </el-radio-group>
    </div>
    <div id="warnTrendEcharts" style="width: 100%; height: 300px"></div>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, toRefs } from "vue";
import bigScreenApi from "@/api/bigScreen";
import * as echarts from "echarts";

export default {
  name: "WarnTrend",
  setup() {
    const state = reactive({
      charts1: null,
      xData: [],
      yData: [],
      radio: 1,
    });
    const funMethods = {
      initCharts() {
        state.charts1 = echarts.init(
          document.getElementById("warnTrendEcharts") as any
        );
        state.charts1.setOption(
          {
            xAxis: {
              type: "category",
              data: state.xData,
              axisLabel: {
                textStyle: {
                  color: "#fff",
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
      changeRadioFun(val: any) {
        state.radio = val;
        requestMethods.getunKnowAssetFun();
      },
    };
    const requestMethods = {
      // 获取告警趋势
      async getunKnowAssetFun() {
        const res = await bigScreenApi.warnTrendInfo({
          dimensionality: state.radio,
        });
        state.yData = res.map((m: any) => m.count);
        state.xData = res.map((m: any) => m.name);
        funMethods.initCharts();
      },
    };

    onMounted(() => {
      requestMethods.getunKnowAssetFun();
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
.warn-trend {
  padding: 20px;
  height: calc(100% - 40px);
  width: calc(100% - 40px);
  color: #fff;
  .title {
    display: flex;
    flex-direction: row;
    margin-left: 10px;
  }
}
</style>

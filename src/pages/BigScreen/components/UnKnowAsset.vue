<template>
  <div class="un-know-asset">
    <div class="title">
      <dv-decoration-2
        :reverse="true"
        style="width: 10px; height: 20px"
      />未知资产概况
    </div>
    <div id="unknowAsset" style="width: 100%; height: 90%"></div>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, toRefs } from "vue";
import bigScreenApi from "@/api/bigScreen";
import * as echarts from "echarts";

export default {
  name: "UnKnowAsset",
  setup() {
    const state = reactive({
      charts1: null,
      xData: [],
      yData: [],
    });
    const funMethods = {
      // 折线图参数
      initCharts() {
        state.charts1 = echarts.init(
          document.getElementById("unknowAsset") as any
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
      // 获取资产概况
      async getunKnowAssetFun() {
        const res = await bigScreenApi.unKnowInfo({});
        state.yData = res[0].data;
        state.xData = res[1].categories;
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
.un-know-asset {
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

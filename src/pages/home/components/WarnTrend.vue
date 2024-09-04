<template>
  <div class="warn-trend">
    <div class="title">
      <dv-decoration-2
        :reverse="true"
        style="width: 10px; height: 20px;margin-bottom: 20px;"
      />告警趋势
    </div>
    <div class="content">
      <!-- <div style="display: flex; flex-direction: row; justify-content: center">
        <el-form :inline="true" :model="form" style="z-index:99999;">
          <el-form-item label="总体趋势：">
            <el-select v-model="form.trend" @change="trendSelectFun">
              <div v-for="m in allOption" :key="m.value">
                <el-option :label="m.label" :value="m.value" />
              </div>
            </el-select>
          </el-form-item>
          <el-form-item label="等级类别：">
            <el-select v-model="form.levelType" @change="warnSelectFun" clearable>
              <div v-for="m in levelOption" :key="m.value">
                <el-option :label="m.label" :value="m.value" />
              </div>
            </el-select>
          </el-form-item>
        </el-form>
      </div> -->
      <div id="warnTrendEcharts" style="width: 100%; height: 100%;padding-left: 20px;"></div>
    </div>
    <WarnProport ref="warnProportRef"/>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, toRefs } from "vue";
import * as echarts from "echarts";
import { markRaw } from 'vue'
import WarnProport from "./WarnProport.vue";
import { levelOption, allOption } from "@/utils/enum";
import homeApi from "@/api/home";

export default {
  name: "WarnTrend",
  components: { WarnProport },
  setup() {
    const state = reactive({
      levelOption,
      allOption,
      form: {
        trend: 1,
        levelType: "",
      },
      charts1: null,
      xData: [],
      yData: [],
      radio: 1,
      warnProportRef:null,
    });
    const funMethods = {
      initCharts() {
        state.charts1 = markRaw(echarts.init(
          document.getElementById("warnTrendEcharts") as any
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
            // toolbox: {
            //   feature: {
            //     saveAsImage: {},
            //   },
            // },
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
                areaStyle: {
                  color: "#0b356a",
                },
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
      trendSelectFun(val:any){
        state.form.trend = val;
        requestMethods.getunKnowAssetFun();
      },
      warnSelectFun(val:any){
        state.form.levelType = val;
        requestMethods.getunKnowAssetFun();
      }
    };
    const requestMethods = {
      // 获取告警趋势
      async getunKnowAssetFun() {
        const res = await homeApi.warnTrend({
          dimensionality: state.form.trend,
          severity:state.form.levelType,
        });
        state.yData = res.map((m: any) => m.count);
        state.xData = res.map((m: any) => m.name);
        funMethods.initCharts();
      },
      //获取威胁排名
      getList(){
        state.warnProportRef.getList('desc');
      }
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
  height: 100%;
  // width: calc(100% - 40px);
  color: #fff;
  // background-color: red;
  .title {
    display: flex;
    flex-direction: row;
    margin-left: 10px;
    font-size: 22px;
  }

  .content {
    width: 100%;
    height: 38%;
    background-color: #021438;
    border-radius: 14px;
  }
}
</style>

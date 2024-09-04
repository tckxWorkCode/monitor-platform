<template>
  <div class="threat-distribute">
    <div class="title">
      <dv-decoration-2
        :reverse="true"
        style="width: 10px; height: 20px"
      />主机威胁分布
    </div>
    <div id="theartEcharts" style="width: 100%;height: 90%;"></div>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, toRefs } from "vue";
import * as echarts from "echarts";
import believeApi from "@/api/bigScreen";

export default {
  name: "ThreatDistribute",
  setup() {
    const state = reactive({
      charts1:null,
      xData:[],
      yData:[]
    });
    const funMethods = {
        // 柱状图参数配置
        initCharts(){
          state.charts1 = echarts.init(document.getElementById('theartEcharts') as any);
          state.charts1.setOption({
            color: ['#0977d9'],
            xAxis: {
              type: 'category',  
              data: state.xData,
              splitLine:{
                show:false,  
              },
              axisLabel: {
                textStyle:{
                  color:'#fff', 
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
              type: 'value',
              splitLine:{
                show:false,
              },
              axisLabel: {
                textStyle:{
                  color:'#fff', 
                },
              },
            },
            series: [
              {
                data: state.yData,
                type: 'bar',
                barWidth:'16%',
                showBackground: true,
                backgroundStyle: {
                  color: 'rgba(180, 180, 180, 0.2)'
                }
              }
            ]
          },true)
          window.onresize = function(){
            state.charts1.resize();
          }
        }
    };
    const requestMethods = {
      //获取威胁分布的接口
      async getTheartInfo(){
        const res = await believeApi.theartInfo({})
        state.xData = res.map((m:any)=>m.name)
        state.yData = res.map((m:any)=>m.count)
        if(state.xData || state.yData){
          funMethods.initCharts();
        }
      }
    };

    onMounted(()=>{
      requestMethods.getTheartInfo();
    })

    return {
      ...toRefs(state),
      ...funMethods,
      ...requestMethods,
    };
  },
};
</script>

<style lang="scss" scoped>
.threat-distribute {
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

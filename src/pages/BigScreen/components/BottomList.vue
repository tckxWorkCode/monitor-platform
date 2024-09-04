<template>
  <div class="bottom-list">
    <el-scrollbar style="height: 100%" ref="scrollbar">
      <dv-scroll-board
        :config="config"
        style="width: 100%; height: 27vh; margin-left: 0px;"
      />
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, toRefs } from "vue";
import believeApi from "@/api/bigScreen";
import {levelEnum} from "@/utils/enum";
export default {
  name: "BottomList",
  setup() {
    const state = reactive({
      config: {
        header: [ "告警等级", "主机Ip", "风险分数", "行为分析", "场景关联", "主体名称", "客体名称", "操作", "启动参数", "描述", "上报时间", ],
        data: [],
        waitTime: 3000,
        rowNum: 6,
        headerBGC: "#012e5c",
        oddRowBGC: "rgba(3, 103, 132, 0.25)",
        evenRowBGC: "rgba(0,186,244,0.05)",
      },
    });
    const funMethods = {};
    const requestMethods = {
        // 获取列表
        async getListFun(){
            const payload = {
                "status": 0,
                "page": 1,
                "size": 20,
                "sortname": "timestamp",
                "order": 2
            }
            const res = await believeApi.warnList(payload)
            res.list.map(function(value,index){
              if(value.hasOwnProperty('host')){
                if(Array.isArray(value.host.ip)){
                 value.hostip = value.host.ip[0]
                }
              }
              value.name = value.attck.rule
              value.event_type = value.attck.event_type
              value.object_type = value.attck.object_type
              value.object = value.attck.object
              value.extra_args = value.attck.extra_args
              value.op = value.attck.op
              value.tactics = value.attck.tactics
              value.techniques = value.attck.techniques
              value.subtechniques = value.attck.subtechniques
              value.behavior_analyse_result = value.behavior_analyse.result
              value.syscal_dmeasure_result = value.syscal_dmeasure.result
            })
           const newData =  res.list.map((m,i)=>{
              return [
                `<div style=' width: 52px;
    height: 22px;
    line-height: 22px;
    margin-top:10px;
    text-align: center;
    background-color: #CF7847;
    '>${levelEnum[m.alarm_level]}</div>`,
                m.hostip,m.alert_score,m.behavior_analyse.result,m.attck.sceneRef,m.attck.name,m.object,m.op,m.extra_args,m.attck?m.attck.desc.info:'',m.record_time
              ]
            })
            state.config.data = newData
            state.config = {...state.config}
        }
    };

    onMounted(()=>{
        requestMethods.getListFun()
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
.bottom-list {
  padding: 20px;
  height: calc(100% - 40px);
  width: calc(100% - 40px);
  color: #fff;
}
</style>

<template>
  <div class="rules-man">
    <el-tabs v-model="tabName" type="border-card" @tab-change="changeTabFun">
      <el-tab-pane label="中心规则" name="centerRule"> <CenterRules ref="centerRuleRef"/> </el-tab-pane>
      <el-tab-pane label="终端规则" name="nodeRule"> <NodeRules ref="nodeRuleRef"/> </el-tab-pane>
      <el-tab-pane label="终端代理" name="manage"> <Manage ref="manageRef"/> </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs } from "vue";
import CenterRules from "./components/CenterRules.vue";
import NodeRules from "./components/NodeRules.vue";
import Manage from "./components/Manage.vue";
import './index.scss';

export default {
  name: "RulesMan",
  components: { CenterRules, NodeRules, Manage },
  setup() {
    const state = reactive({
      tabName:'centerRule',
      manageRef:null,
      centerRuleRef:null,
      nodeRuleRef:null,
    });
    const funMethods = {
      changeTabFun(val){
        state.tabName = val;
        if(val=='centerRule'){
          state.centerRuleRef.resetFun();
        }else if(val=='nodeRule'){
          state.nodeRuleRef.resetFun();
        }else if(val=='manage'){
          state.manageRef.resetFun();
        }
      }
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
.rules-man {
  height: calc(100vh - 100px);
  width: calc(100% - 40px);
  padding-left: 20px;
  padding-right: 20px;
  background-image: url("../../assets/bigScreen/menu/backImg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  color: #fff;
}
</style>

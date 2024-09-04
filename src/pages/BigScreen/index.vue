<template>
  <div class="home">
    <div class="top">
      <div class="top-left">
        <dv-border-box-1 class="top-left-top"> <AssetView /> </dv-border-box-1>
        <dv-border-box-1 class="top-left-bottom"> <ThreatDistribute /> </dv-border-box-1>
      </div>
      <div class="top-center">
        <dv-border-box-1> <CenterRisk /> </dv-border-box-1>
      </div>
      <div class="top-right">
        <dv-border-box-1 class="top-right-top"><WarnTrend/></dv-border-box-1>
        <dv-border-box-1 class="top-right-bottom"><WarnProport/></dv-border-box-1>
      </div>
    </div>
    <div class="bottom">  
      <dv-border-box-1 class="bottom-left"> <UnKnowAsset /> </dv-border-box-1>
      <dv-border-box-1 class="bottom-right"> <BottomList /> </dv-border-box-1>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs } from "vue";
import CenterRisk from "./components/CenterRisk.vue";
import AssetView from "./components/AssetView.vue";
import ThreatDistribute from "./components/ThreatDistribute.vue";
import UnKnowAsset from "./components/UnKnowAsset.vue";
import BottomList from "./components/BottomList.vue";
import WarnProport from "./components/WarnProport.vue";
import WarnTrend from "./components/WarnTrend.vue";

export default {
  name: "bigScreen",
  components: {
    AssetView,
    ThreatDistribute,
    UnKnowAsset,
    CenterRisk,
    BottomList,
    WarnProport,
    WarnTrend,
  },
  setup() {
    const state = reactive({});
    const funMethods = {};
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
.home {
  height: calc(100vh - 110px);
  width: calc(100% - 20px);
  background-image: url("../../assets/bigScreen/menu/backImg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
  .top {
    flex: 2;
    display: flex;
    flex-direction: row;
    .top-left {
      flex: 1;
      display: flex;
      flex-direction: column;
      .top-left-top {
        flex: 1;
      }
      .top-left-bottom {
        flex: 1;
      }
    }
    .top-center {
      flex: 1;
    }
    .top-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      .top-right-top {
        flex: 1;
      }
      .top-right-bottom {
        flex: 1;
      }
    }
  }
  .bottom {
    flex: 1;
    display: flex;
    flex-direction: row;
    margin-bottom: 30px;
    .bottom-left {
      flex: 1;
    }
    .bottom-right {
      flex: 2;
    }
  }
}
</style>

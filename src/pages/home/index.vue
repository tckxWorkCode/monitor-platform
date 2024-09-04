<template>
  <div class="home">
    <div class="top">
      <div class="top-left">
        <dv-border-box-1 class="top-left-top">
          <AssetView ref="assetViewRef" />
        </dv-border-box-1>
      </div>
      <div class="top-center">
        <dv-border-box-1> <CenterRisk ref="centerRiskRef" /> </dv-border-box-1>
      </div>
      <div class="top-right">
        <dv-border-box-1 class="top-right-top">
          <WarnTrend ref="warnTrendRef" />
        </dv-border-box-1>
      </div>
    </div>
    <div class="bottom">
      <dv-border-box-1 class="bottom-right">
        <BottomList @onHandleFinish="onHandleFinish" />
      </dv-border-box-1>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs } from "vue";
import CenterRisk from "./components/CenterRisk.vue";
import AssetView from "./components/AssetView.vue";
import BottomList from "./components/BottomList.vue";
import WarnProport from "./components/WarnProport.vue";
import WarnTrend from "./components/WarnTrend.vue";

export default {
  name: "home",
  components: {
    AssetView,
    CenterRisk,
    BottomList,
    WarnProport,
    WarnTrend,
  },
  setup() {
    const state = reactive({
      centerRiskRef: null,
      warnTrendRef: null,
      assetViewRef: null,
    });
    const funMethods = {};
    const requestMethods = {
      onHandleFinish() {
        setTimeout(() => {
          state.centerRiskRef.getRight();
          state.warnTrendRef.getList("desc");
          state.assetViewRef.getNewList();
        }, 1000);
      },
    };

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
  // overflow-y: hidden;
  .top {
    // background-color: pink;
    // flex: 1;
    display: flex;
    flex-direction: row;
    .top-left {
      // background-color: red;
      min-width: 30%;
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
      // background-color: yellow;
      flex: 1;
      min-width: 30%;
    }
    .top-right {
      // background-color: gray;
      flex: 1;
      min-width: 30%;
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
    // background-color: blue;
    // flex: 2;
    display: flex;
    flex-direction: row;
    margin-bottom: 30px;
    // .bottom-left {
    //   flex: 1;
    // }
    // .bottom-right {
    //   flex: 2;
    // }
  }
}
</style>

<template>
  <div class="asset-view">
    <div class="title">
      <dv-decoration-2
        :reverse="true"
        style="width: 10px; height: 20px"
      />资产视图
    </div>
    <div class="content">
      <dv-active-ring-chart :config="configLeft" class="left-view" />
      <div style="margin-left: -40px; margin-top: 40px">
        <div v-for="m in leftFirstData" class="for-content">
          <div
            :style="`width: 40px;height: 20px;background:${m.color};border-radius:4px`"
          ></div>
          <div style="color: #fff; margin-left: 15px">{{ m.name }}</div>
          <div class="leftfirstStyle" style="color: #fff">
            <div v-if="m.name == '附加核可信根'" style="margin-left: -16px">
              {{ m.value }}
            </div>
            <div v-else>{{ m.value }}</div>
          </div>
        </div>
      </div>
      <dv-active-ring-chart :config="configRight" class="right-view" />
      <div style="margin-left: -40px; margin-top: 100px">
        <div
          v-for="m in leftFirstTwoData"
          style="display: flex; flex-direction: row; margin-top: 15px"
        >
          <div
            :style="`width: 30px;height: 15px;background:${m.color};border-radius:4px;margin-top:3px`"
          ></div>
          <div style="color: #fff; margin-left: 15px">{{ m.name }}</div>
          <div class="leftfirstStyle" style="color: #fff">
            <div v-if="m.name == '不可信'" style="margin-left: -15px">
              {{ m.value }}
            </div>
            <div v-else>{{ m.value }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, toRefs } from "vue";
import bigScreenApi from "@/api/bigScreen";
export default {
  name: "AssetView",
  setup() {
    const state = reactive({
      leftFirstData: [],
      leftFirstTwoData: [
        { name: "不可信", color: "#5470c6", value: "1" },
        { name: "可信", color: "#91cc75", value: "0" },
      ],
      configLeft: {
        data: [],
        radius: "50%",
        digitalFlopStyle: {
          fontSize: 12,
          fill: "#fff",
        },
        digitalFlopToFixed: 2,
        color: ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de"],
      },
      configRight: {
        data: [],
        radius: "50%",
        activeTimeGap: 100000,
        digitalFlopStyle: {
          fontSize: 12,
          fill: "#fff",
        },
        digitalFlopToFixed: 2,
        color: ["#5470c6", "#91cc75"],
      },
    });
    const funMethods = {};
    const requestMethods = {
      //获取可信信息
      async getBelieve() {
        const res = await bigScreenApi.believeInfo({});
        var newData = [
          { name: "可信软件基", value: res.trustTsb, color: "#5470c6" },
          {
            name: "主核可信根",
            value: res.tpcmType.tpcm_nucleus,
            color: "#91cc75",
          },
          {
            name: "附加核可信根",
            value: res.tpcmType.tpcm_additional,
            color: "#fac858",
          },
          {
            name: "模拟可信根",
            value: res.tpcmType.tpcm_imitate,
            color: "#ee6666",
          },
          {
            name: "外置可信根",
            value: res.tpcmType.tpcm_out,
            color: "#73c0de",
          },
        ];
        state.configLeft.data = newData;
        state.configLeft = { ...state.configLeft };
        state.leftFirstData = newData;
      },

      // 获取可信评分
      async getBelieveFun() {
        const res = await bigScreenApi.believeLevel({});
        var newData1 = [
          { name: "不可信", value: res.untrustCount },
          { name: "可信", value: res.trustCount },
        ];
        state.configRight.data = newData1;
        state.configRight = { ...state.configRight };
      },
    };
    onMounted(() => {
      requestMethods.getBelieve();
      requestMethods.getBelieveFun();
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
.asset-view {
  padding: 20px;
  height: calc(100% - 40px);
  width: calc(100% - 40px);
  color: #fff;
  .title {
    display: flex;
    flex-direction: row;
    margin-left: 10px;
  }
  .content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 20px;
    justify-content: center;
    height: 100%;
    .left-view {
      width: 300px;
      height: 300px;
      margin-left: -10%;
    }

    .for-content {
      display: flex;
      flex-direction: row;
      margin-top: 15px;
    }

    .right-view {
      width: 300px;
      height: 300px;
    }
    .leftfirstStyle {
      color: #fff;
      margin-left: 30px;
      font-weight: bold;
    }
  }
}
</style>

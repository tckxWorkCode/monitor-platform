<template>
  <div class="warn-proport">
    <div class="title">
      <dv-decoration-2
        :reverse="true"
        style="width: 10px; height: 20px"
      />告警占比
      <dv-active-ring-chart
        :config="config1"
        style="width: 300px; height: 300px; margin-left: 10%"
      />
      <div class="right-style">
        <div class="levelStylecm">
          <div class="itemcm" style="background-color: #af181a"></div>
          &nbsp;&nbsp;严重告警
        </div>
        <div class="levelStylecm">
          <div class="itemcm" style="background-color: #0187bf"></div>
          &nbsp;&nbsp;高级告警
        </div>
        <div class="levelStylecm">
          <div class="itemcm" style="background-color: #01975f"></div>
          &nbsp;&nbsp;中级告警
        </div>
        <div class="levelStylecm">
          <div class="itemcm" style="background-color: #ba7229"></div>
          &nbsp;&nbsp;低级告警
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, toRefs } from "vue";
import believeApi from "@/api/bigScreen";
import { newDataEnum } from "@/utils/enum";

export default {
  name: "WarnProport",
  setup() {
    const state = reactive({
      config1: {
        data: [],
        digitalFlopToFixed: 2,
        color: ["#017bae", "#af181a","red","green"],
      },
    });
    const funMethods = {};
    const requestMethods = {
      // 获取告警占比
      async getWarnProportFun() {
        const res = await believeApi.warnProporInfo({ dimensionality: 2 });
        const newData = res.map((m: any) => {
          return {
            name: newDataEnum[m.name],
            value: m.count,
          };
        });
        state.config1.data = newData;
        state.config1 = { ...state.config1 };
      },
    };

    onMounted(() => {
      requestMethods.getWarnProportFun();
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
.warn-proport {
  padding: 20px;
  height: calc(100% - 40px);
  width: calc(100% - 40px);
  color: #fff;
  .title {
    display: flex;
    flex-direction: row;
    margin-left: 10px;
  }
  .right-style {
    position: absolute;
    color: #fff;
    right: 200px;
    top: 120px;
  }
  .levelStylecm {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
  }

  .itemcm {
    border-radius: 50%;
    height: 15px;
    width: 15px;
  }
}
</style>

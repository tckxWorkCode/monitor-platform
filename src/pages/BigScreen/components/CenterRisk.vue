<template>
  <div class="center-risk">
    <div class="top">
      <div class="top-left">
        <div class="value">4</div>
        <div>设备总量</div>
      </div>
      <div class="top-right">
        <div class="value">224879</div>
        <div>告警总量</div>
      </div>
    </div>
    <div class="center">
      <img :src="require('@/assets/bigScreen/centerRisk/alarm.png')" />
    </div>
    <div class="bottom">
      <div v-for="m in items" :key="m.value">
        <div class="item-img-bottom z2" v-if="m.img == 'z2'">
          <div class="value">{{ m.value }}</div>
          <div>{{ m.name }}</div>
        </div>
        <div class="item-img-bottom z1" v-else>
          <div class="value">{{ m.value }}</div>
          <div>{{ m.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs } from "vue";
export default {
  name: "centerRisk",
  setup() {
    const state = reactive({
      items: [
        { name: "在线设备", value: "0", img: "z1" },
        { name: "离线设备", value: "4", img: "z1" },
        { name: "异常设备", value: "0", img: "z2" },
        { name: "关闭", value: "0", img: "z1" },
        { name: "已知", value: "0", img: "z1" },
      ],
    });
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
.center-risk {
  position: relative;
  padding: 20px;
  color: #fff;
  display: flex;
  flex-direction: column;
//   justify-content: center;
  align-items: center;
  height: calc(100% - 40px);
  width: calc(100% - 40px);
  font-weight: bold;
  .top {
    height: 60px;
    width: 100%;
    display: flex;
    margin-top: 50px;
    flex-direction: row;
    justify-content: space-between;
    .top-left {
      padding-left: 100px;
      width: 250px;
      height: 100px;
      background-image: url("@/assets/bigScreen/centerRisk/dtotal.png");
      background-repeat: no-repeat;
    }
    .top-right {
      padding-left: 100px;
      width: 130px;
      height: 100px;
      background-image: url("@/assets/bigScreen/centerRisk/btotal.png");
      background-repeat: no-repeat;
    }
    .value {
      margin-bottom: 5px;
      font-size: 24px;
      font-weight: bold;
      margin-top: 30px;
    }
  }
  .center{
    margin-top: 50px;
  }
  .bottom {
    position: absolute;
    bottom: 90px;
    display: flex;
    flex-direction: row;
    .item-img-bottom {
      height: 100px;
      width: 75px;
      display: flex;
      // justify-content: center;
      align-items: center;
      flex-direction: column;
      position: relative;
    }
    .z2 {
      background-image: url("@/assets/bigScreen/centerRisk/z2.png");
      background-repeat: no-repeat;
    }
    .z1 {
      background-image: url("@/assets/bigScreen/centerRisk/z1.png");
      background-repeat: no-repeat;
    }
    .value {
      margin-bottom: 5px;
      font-size: 24px;
      font-weight: bold;
      margin-top: 20px;
    }
  }
}
</style>

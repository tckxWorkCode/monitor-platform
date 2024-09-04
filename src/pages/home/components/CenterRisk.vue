<template>
  <div class="center-risk">
    <div class="top">
      <div class="top-left">
        <div class="value">{{ leftCount }}</div>
        <div>设备总量</div>
      </div>
      <div class="top-right">
        <div class="value">{{ rightCount }}</div>
        <div>告警总量</div>
      </div>
    </div>
    <div class="center">
      <img :src="require('@/assets/bigScreen/centerRisk/warn.png')" />
    </div>  
    <div class="bottom">
      <!-- <div v-for="m in items" :key="m.value"> -->
      <div class="item-img-bottom z1 anii1">
        <div class="value">{{ item.senior }}</div>
        <div>智能可信</div>
      </div>
      <div class="item-img-bottom z1 aniii1">
        <div class="value">{{ item.junior }}</div>
        <div>基础可信</div>
      </div>
      <div class="item-img-bottom z2 aniiii1">
        <div class="value">{{ item.untrust }}</div>
        <div>非可信</div>
      </div>
      <div class="item-img-bottom z1 aniiiii1">
        <div class="value">{{ rightItem.unhandled }}</div>
        <div>未处置</div>
      </div>
      <div class="item-img-bottom z1 aniiiiii1">
        <div class="value">{{rightItem.handled}}</div>
        <div>已处置</div>
      </div>
      <!-- <div class="item-img-bottom z2" v-if="m.img == 'z2'">
          <div class="value">{{ m.value }}</div>
          <div>{{ m.name }}</div>
        </div>
        <div class="item-img-bottom z1" v-else>
          <div class="value">{{ m.value }}</div>
          <div>{{ m.name }}</div>
        </div> -->
      <!-- </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, toRefs } from "vue";
import homeApi from "@/api/home/index";
import believeApi from "@/api/bigScreen/index";
export default {
  name: "centerRisk",
  setup() {
    const state = reactive({
      leftCount: 0,
      rightCount: 0,
      item: {
        junior: 0,
        senior: 0,
        untrust: 0,
      },
      rightItem: {
        unhandled: 0,
        handled: 0,
      },
    });
    const funMethods = {};
    const requestMethods = {
      // 获取数据
      async getInfoFun() {
        const res = await homeApi.centerLeftTotal({});
        state.leftCount = res.all;
        state.item = {
          junior: res.junior,  //基础可信
          senior: res.senior,
          untrust: res.untrust,
        };
      },

      // 右侧获取数据
      async getRight() {
        const res = await homeApi.centerTotal({});
        state.rightCount = res.total
        state.rightItem = {
          unhandled: res.unhandled,
          handled: res.handled,
        };
      },
    };

    onMounted(() => {
      requestMethods.getInfoFun();
      requestMethods.getRight();
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
  .center {
    margin-top: 50px;
  }
  .bottom {
    position: absolute;
    bottom: 60px;
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
      margin-left: 10px;
      margin-right: 10px;
      // &:nth-child(1){
      //   margin-bottom: 120px;
      // }
      //   animation: ani1 1s alternate 0s linear infinite;
      // -moz-animation: ani1 1s alternate 0s linear infinite;	/* Firefox */
      // -webkit-animation: ani1 1s  alternate 0s linear infinite ;	/* Safari 和 Chrome */
      // -o-animation: ani1 1s alternate 0s linear infinite;	/* Opera */
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

.anii1 {
  top: -120px;
  right: 60px;
  animation: ani1 1s alternate 0s linear infinite;
  -moz-animation: ani1 1s alternate 0s linear infinite; /* Firefox */
  -webkit-animation: ani1 1s alternate 0s linear infinite; /* Safari 和 Chrome */
  -o-animation: ani1 1s alternate 0s linear infinite; /* Opera */
}
.aniii1 {
  top: -60px;
  right: 30px;
  animation: ani1 1s alternate 0.2s linear infinite;
  -moz-animation: ani1 1s alternate 0.2s linear infinite; /* Firefox */
  -webkit-animation: ani1 1s alternate 0.2s linear infinite; /* Safari 和 Chrome */
  -o-animation: ani1 1s alternate 0.2s linear infinite; /* Opera */
}
.aniiii1 {
  animation: ani1 1s alternate 0.4s linear infinite;
  -moz-animation: ani1 1s alternate 0.4s linear infinite; /* Firefox */
  -webkit-animation: ani1 1s alternate 0.4s linear infinite; /* Safari 和 Chrome */
  -o-animation: ani1 1s alternate 0.4s linear infinite; /* Opera */
}
.aniiiii1 {
  top: -60px;
  left: 30px;
  animation: ani1 1s alternate 0.6s linear infinite;
  -moz-animation: ani1 1s alternate 0.6s linear infinite; /* Firefox */
  -webkit-animation: ani1 1s alternate 0.6s linear infinite; /* Safari 和 Chrome */
  -o-animation: ani1 1s alternate 0.6s linear infinite; /* Opera */
}
.aniiiiii1 {
  top: -120px;
  left: 60px;
  animation: ani1 1s alternate 0.8s linear infinite;
  -moz-animation: ani1 1s alternate 0.8s linear infinite; /* Firefox */
  -webkit-animation: ani1 1s alternate 0.8s linear infinite; /* Safari 和 Chrome */
  -o-animation: ani1 1s alternate 0.8s linear infinite; /* Opera */
}

@keyframes ani1 {
  0% {
    transform: translate(0px, 5px);
  }
  50% {
    transform: translate(0px, 0px);
  }
  100% {
    transform: translate(0px, -5px);
  }
}
@-moz-keyframes ani1 {
  0% {
    transform: translate(0px, 5px);
  }
  50% {
    transform: translate(0px, 0px);
  }
  100% {
    transform: translate(0px, -5px);
  }
}
@-webkit-keyframes ani1 {
  0% {
    transform: translate(0px, 5px);
  }
  50% {
    transform: translate(0px, 0px);
  }
  100% {
    transform: translate(0px, -5px);
  }
}
@-o-keyframes ani1 {
  0% {
    transform: translate(0px, 5px);
  }
  50% {
    transform: translate(0px, 0px);
  }
  100% {
    transform: translate(0px, -5px);
  }
}
</style>

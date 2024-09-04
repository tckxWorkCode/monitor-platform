<template>
  <div class="warn-proport">
    <div class="title">
      <dv-decoration-2
        :reverse="true"
        style="width: 10px; height: 20px"
      />威胁性排名Top{{ count }}
    </div>
    <div class="content">
      <!-- <div class="tip-title">TOP{{ count }}</div> -->
      <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
        <!-- <el-tab-pane label="安全性" name="first"> </el-tab-pane> -->
        <!-- <el-tab-pane label="脆弱性" name="second"> </el-tab-pane>
        <el-tab-pane label="漏洞情况" name="third"> </el-tab-pane> -->
        <!-- <div class="btns">
          <el-button link @click="getList('asc')">升序<el-icon><Top /></el-icon></el-button>
          <el-button link @click="getList('desc')">降序<el-icon><Bottom /></el-icon></el-button>
        </div> -->
        <div style="overflow-y: auto; height: 22vh; overflow-x: hidden">
          <div v-for="(m, i) in borderData" :key="i">
            <div class="item">
              <div class="top">
                <div class="left">
                  <div class="left_font">No.{{ i + 1 }}</div>
                  <div>{{ m.name }}</div>
                </div>
                <div class="right">{{ m.value }}</div>
              </div>
              <div
                class="item-content"
                :style="`width:${m.value}%;background-color:${
                  colorEnum[m.value]
                }`"
              ></div>
              <div class="bottom"></div>
            </div>
          </div>
        </div>
        <!-- <dv-scroll-ranking-board
          :config="config"
          style="width: 30vw; height: 280px;"
        /> -->
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, toRefs } from "vue";
import homeApi from "@/api/home";
import "../index.scss";

export default {
  name: "WarnProport",
  setup() {
    const state = reactive({
      count: 10,
      borderData: [],
      colorEnum: {
        30: "#ec3f4c",
        60: "#f5d53f",
        90: "#59ab22",
      },
      config: {
        data: [],
        color: ["#017bae", "#af181a", "red"],
        sort: false,
        carousel: "single",
      },
      activeName: "first",
    });
    const funMethods = {
      handleClick(name: any) {
        requestMethods.getList();
      },
      orderFun(flag:any){
        
      }
    };
    const requestMethods = {
      async getList() {

        const res = await homeApi.orderList({});
        if (res.msg) {
          return;
        }
        // console.log(res);
        
        // state.config.data = newData;
        // state.colorEnum = {
        //   30: "#ec3f4c",
        //   60: "#f5d53f",
        //   90: "#59ab22",
        // };
        // console.log(res);
        const newData =  res.map((m:any)=>{
          return {
            name:m.ip,
            value:m.count
          }
        })
        
        state.borderData = newData;
        // state.config = { ...state.config };
        // if (name == "first") {
        //   // const newData = res.assetTop.safeAsset.map((m: any) => {
        //   //   return {
        //   //     name: m.ip,
        //   //     value: m.score,
        //   //   };
        //   // });
        //   // newData.push({ name: "", value: 100 });
        //   // state.count = newData.length;
        // } else if (name == "second") {
        //   const newData = res.assetTop.weakAsset.map((m: any) => {
        //     return {
        //       name: m.ip,
        //       value: m.score,
        //     };
        //   });
        //   state.borderData = newData;
        //   // state.count = newData.length;
        //   state.colorEnum = {
        //     30: "#59ab22",
        //     60: "#f5d53f",
        //     90: "#ec3f4c",
        //   };
        // } else {
        //   const newData = res.assetTop.leakAsset.map((m: any) => {
        //     return {
        //       name: m.ip,
        //       value: m.score,
        //     };
        //   });
        //   // newData.push({ name: "", value: 100 });
        //   // state.count = newData.length;
        //   state.config.data = newData;
        //   state.colorEnum = {
        //     30: "#59ab22",
        //     60: "#f5d53f",
        //     90: "#ec3f4c",
        //   };
        //   state.borderData = newData;
        //   state.config = { ...state.config };
        // }
      },
    };

    onMounted(() => {
      requestMethods.getList();
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
  // padding: 20px;
  height: 45%;
  // overflow-y: auto;
  // width: calc(100% - 40px);
  // color: #fff;
  .title {
    display: flex;
    flex-direction: row;
    margin-left: 10px;
    margin-top: 20px;
    margin-bottom: 15px;
    font-size: 22px;
  }
  .content {
    height: 100%;
    width: 100%;
    background-color: #021438;
    display: flex;
    justify-content: center;
    position: relative;
    border-radius: 14px;
    .tip-title {
      position: absolute;
      top: 10px;
      right: 20px;
      color: #1370fb;
      font-weight: bold;
      z-index: 9999;
    }
  }
}

.score-above-60 {
  color: green; /* 分数高于60的颜色 */
}

.score-below-60 {
  color: orange; /* 分数低于60的颜色 */
}

.btns {
  margin-bottom: 10px;
}

.item {
  width: 28vw;
  margin-bottom: 20px;
  font-size: 16px;
  .top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .left {
      display: flex;
      flex-direction: row;
      .left_font {
        color: #0f5bce;
        margin-right: 20px;
      }
    }
    // .right {
    // }
  }
  .bottom {
    height: 2px;
    background-color: #0b429a;
  }

  .item-content {
    height: 6px;
    background-color: #1370fb;
  }
}
</style>

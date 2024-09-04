<template>
  <div class="asset-view">
    <div class="title">
      <dv-decoration-2
        :reverse="true"
        style="width: 10px; height: 20px"
      />资产概况
    </div>
    <el-radio-group v-model="radio" @change="radioFun">
      <el-radio :label="0">所有</el-radio>
      <el-radio :label="4">智能可信</el-radio>
      <el-radio :label="3">基础可信</el-radio>
      <el-radio :label="1">非可信</el-radio>
    </el-radio-group>
    <div class="content">
      <div v-for="m in assetsData">
        <div v-if="assetsData.length < 0">暂无数据</div>
        <div class="item">
          <el-popover
            placement="top-start"
            :width="100"
            trigger="hover"
            :content="m.ip"
            popper-style="text-align: center;font-size:16px"
          >
            <template #reference>
              <div style="position: relative">
                <img
                v-if="m.state == 5"
                  style="
                    height: 35px;
                    position: absolute;
                    right: 45px;
                    top: -10px;
                  "
                  :src="require('@/assets/home/warn.gif')"
                />
                <img
                  v-if="m.state == 1"
                  class="imgStyle"
                  :src="require('@/assets/bigScreen/leftTop/errortrust.png')"
                />
                <img
                  v-else-if="m.state == 2"
                  class="imgStyle"
                  :src="require('@/assets/bigScreen/leftTop/untrust.png')"
                />
                <img
                  v-else-if="m.state == 3"
                  class="imgStyle"
                  :src="require('@/assets/bigScreen/leftTop/commontrust.png')"
                />
                <img
                  v-else-if="m.state == 4"
                  class="imgStyle"
                  :src="require('@/assets/bigScreen/leftTop/aitrust.png')"
                />
                <!-- 有警告日志 -->
                <img
                  v-else-if="m.state == 5"   
                  class="imgStyle"
                  :src="require('@/assets/bigScreen/leftTop/aitrust.png')"
                />
                <div class="twoImg">
                  <div> <img width="25" @click="toSysMonitorFun(m)" :src="require('@/assets/home/sys.png')" /> </div>
                  <div style="margin:5px"> <img width="25" @click="toSysMonitorTwoFun(m)" :src="require('@/assets/home/warn.png')" />
                  </div>
                </div>
              </div>
            </template>
          </el-popover>
        </div>
        <div v-if="m.type == 2" :title="m.ip">
          <img
            class="imgStyle"
            :src="require('@/assets/bigScreen/leftTop/printer.png')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onBeforeUnmount, onMounted, reactive, toRefs } from "vue";
import homeApi from "@/api/home";
import { useRouter } from "vue-router";
import sysMonitorApi from "@/api/sysMonitor";
import { ElMessage } from "element-plus";
import "../index.scss";

export default {
  name: "AssetView",
  setup() {
    const router = useRouter();
    const state = reactive({
      radio: 0,
      assetsData: [],
      timer: null,
      count: 0,
    });
    const funMethods = {
      radioFun(val: any) {
        state.radio = val;
        requestMethods.getNewList();
      },
      async toSysMonitorFun(rowInfo: any) {
        const params = {
          page: 1,
          size: 1000,
        };
        const res = await sysMonitorApi.getHostIpInfo(params);
        const newObj: any = res.list.filter((m: any) => m.hostInfo.ip[0] == rowInfo.ip);
        console.log(newObj);

        if (newObj.length > 0) {
          sessionStorage.setItem("toSysIp", rowInfo.ip);
          sessionStorage.setItem("toSysId", rowInfo.id);
          router.push("/sysMonitor");
        } else {
          ElMessage.warning("抱歉, 该终端无系统监控信息！");
        }
      },
      async toSysMonitorTwoFun(rowInfo: any) {
        const params = {
          page: 1,
          size: 1000,
        };
        const res = await sysMonitorApi.getHostIpInfo(params);
        const newObj: any = res.list.filter((m: any) => m.hostInfo.ip[0] == rowInfo.ip);

        if (newObj.length > 0) {
          sessionStorage.setItem("toSysIp", rowInfo.ip);
          sessionStorage.setItem("toSysId", rowInfo.id);
          router.push("/detectWarn");
        } else {
          ElMessage.warning("抱歉, 该终端无监测预警信息！");
        }
      },
    };
    const requestMethods = {
      async getAllData() {
        state.timer = setInterval(async () => {
          state.count++;
          requestMethods.getNewList();
        }, 3000);
      },
      async getNewList() {
        const res = await homeApi.assetData({ flag: state.radio });
        state.assetsData = res.assetInfo;
      },
    };
    onMounted(() => {
      requestMethods.getNewList();
      // requestMethods.getAllData();
    });

    onBeforeUnmount(() => {
      clearInterval(state.timer);
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
:deep(.el-radio) {
  color: #fff;
}
.asset-view {
  padding: 20px;
  height: calc(100% - 40px);
  width: calc(100% - 40px);
  min-width: calc(100% - 40px);
  color: #fff;
  text-align: center;
  .title {
    display: flex;
    flex-direction: row;
    margin-left: 10px;
    font-size: 22px;
  }
  .content {
    background-color: #021438;
    margin-top: 20px;
    padding-top: 20px;
    height: 51vh;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    overflow-y: auto;
    align-content: flex-start;
    border-radius: 14px;
    .item {
      margin-right: 30px;
      // &:hover {
      //   cursor: pointer;
      // }
    }
  }
}

.imgStyle {
  width: 126px;
}

.twoImg {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 30px;
  right: 0px;
  &:hover {
    cursor: pointer;
  }
}

:deep(.el-radio__label){
  font-size: 16px;
}
</style>

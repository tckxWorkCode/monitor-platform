<template>
  <div class="sys-monitor">
    <!-- <div class="title">
      <div class="left">
        <el-form :inline="true" :model="form">
          <el-form-item label="设备标识：">
            <el-input v-model="form.id" placeholder="请输入设备标识" />
          </el-form-item>
          <el-form-item label="主机IP：">
            <el-input v-model="form.ip" placeholder="请输入主机IP" />
          </el-form-item>
          <el-form-item label="时间方向：">
            <el-select v-model="form.timearrows" clearable>
              <div v-for="m in timeOptions" :key="m.value">
                <el-option :label="m.label" :value="m.value" />
              </div>
            </el-select>
          </el-form-item>
          <el-form-item label="时间偏移量：">
            <div class="time-style">
              <el-input
                v-model="form.timeoffsetIpt"
                placeholder="请输入偏移量"
              />
              <el-select v-model="form.timeoffset" clearable>
                <div v-for="m in timeOffsetOptions" :key="m.value">
                  <el-option :label="m.label" :value="m.value" />
                </div>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="时间点：">
            <el-date-picker
              v-model="form.timepoint"
              type="date"
              placeholder="请选择开始日期"
            />
          </el-form-item>
          <el-button type="primary" @click="getListFun">查询</el-button>
          <el-button type="default" @click="resetFun">重置</el-button>
        </el-form>
      </div>
      <div class="right">
        <div class="left-label">筛选：</div>
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="在线" value="Value A" />
          <el-checkbox label="离线" value="Value B" />
          <el-checkbox label="异常" value="Value C" />
        </el-checkbox-group>
      </div>
    </div> -->
    <div class="content">
      <div class="content-left-list">
        <div>终端列表</div>
      </div>
      <div class="content-right">
        <div class="item-content"></div>
        <div class="item-content"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, toRefs } from "vue";
// import sysMonitorApi from "@/api/sysMonitor";
import Descriptions from "../../components/Descriptions/index.vue";
import "./index.scss";

export default {
  name: "SysMonitor",
  components: { Descriptions },
  setup() {
    const state = reactive({
      form: {
        id: "", //设备标识
        ip: "", //主机ip
        timearrows: "", //时间方向
        timeoffsetIpt: "", //时间偏移量(输入框)
        timeoffset: "", //时间偏移量(下拉框)
        timepoint: "", //时间点
      },
      checkList: [],
      timeOptions: [
        { label: "向前", value: "-1" },
        { label: "向后", value: "1" },
      ],
      timeOffsetOptions: [
        { label: "分钟", value: "m" },
        { label: "小时", value: "h" },
        { label: "日", value: "d" },
        { label: "月", value: "M" },
        { label: "年", value: "y" },
      ],
      listItems: [],
    });
    const funMethods = {
      resetFun() {
        state.form = {
          id: "",
          ip: "",
          timearrows: "",
          timeoffsetIpt: "",
          timeoffset: "",
          timepoint: "",
        };
        requestMethods.getListFun();
      },
    };
    const requestMethods = {
      // 获取系统监控列表信息
      async getListFun() {
        const payload = {
          sortname: "@timestamp",
          order: 2,
          id: state.form.id,
          ip: state.form.ip,
          state: "",
          timepoint: state.form.timepoint,
          timeoffset: state.form.timeoffsetIpt + state.form.timeoffset,
          timearrows: state.form.timearrows,
          page: 1,
          size: 10,
        };
        // const res = await sysMonitorApi.getListInfo(payload);
        // let newRes = res.list.map((m: any) => {
        //   let newData = { ...m };
        //   newData.time = m["@timestamp"];
        //   return newData;
        // });
        // state.listItems = newRes;
      },
    };

    onMounted(() => {
      requestMethods.getListFun();
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
.sys-monitor {
  height: calc(100vh - 100px);
  width: 100%;
  // padding-left: 40px;
  // padding-right: 40px;
  background-image: url("../../assets/bigScreen/menu/backImg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  color: #fff;
  .title {
    padding-left: 40px;
    padding-right: 40px;
    height: 66px;
    width: calc(100% - 80px);
    background-color: #05162f;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .left {
      // margin-top: 16px;
      display: flex;
      flex-direction: row;
      align-items: center;
      .time-style {
        display: flex;
        flex-direction: row;
      }
    }
    .right {
      display: flex;
      flex-direction: row;
      align-items: center;
      .left-label {
        color: #2c3e50;
      }
    }
  }
  .content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    height: calc(100% - 20px);

    .content-left-list {
      width: 300px;
      border-right: 1px solid #fff;
      text-align: center;
      padding-top: 20px;
    }

    .content-right{
      width: calc(100% - 302px);
      display: flex;
      flex-direction: row;
      .item-content{
        flex: 1;
        background-color:#050d24;
        &:nth-child(1){
          flex: 3;
          border-right: 1px solid #fff;
        }
      }
    }
    // .content-content {
    //   .item {
    //     width: 470px;
    //     height: 335px;
    //     background-color: #1f232f;
    //     border-radius: 20px;
    //     margin-right: 40px;
    //     opacity: 0.6;
    //     .item-top-online {
    //       height: 121px;
    //       width: 470px;
    //       background-image: url("../../assets//sysMonitor/online.png");
    //       background-size: 100%;
    //       .online {
    //         width: 70px;
    //         height: 30px;
    //         background-color: #58d9f4;
    //         border-radius: 0 0 6px 6px;
    //         display: flex;
    //         justify-content: center;
    //         align-items: center;
    //         float: right;
    //         margin-right: 20px;
    //       }
    //     }
    //     .title-font {
    //       font-size: 18px;
    //       font-weight: bold;
    //       margin-left: 150px;
    //       padding-top: 40px;
    //     }
    //     .title-ip {
    //       margin-left: 150px;
    //       margin-top: 5px;
    //     }
    //     .item-top-offline {
    //       height: 121px;
    //       width: 470px;
    //       background-image: url("../../assets/sysMonitor/offline.png");
    //       background-size: 100%;
    //       .offline {
    //         width: 70px;
    //         height: 30px;
    //         background-color: #616571;
    //         border-radius: 0 0 6px 6px;
    //         display: flex;
    //         justify-content: center;
    //         align-items: center;
    //         float: right;
    //         margin-right: 20px;
    //       }
    //     }
    //     .item-top-error {
    //       height: 121px;
    //       width: 470px;
    //       background-image: url("../../assets//sysMonitor/error.png");
    //       background-size: 100%;
    //       .error {
    //         width: 70px;
    //         height: 30px;
    //         background-color: #f65a90;
    //         border-radius: 0 0 6px 6px;
    //         display: flex;
    //         justify-content: center;
    //         align-items: center;
    //         float: right;
    //         margin-right: 20px;
    //       }
    //     }
    //   }
    // }
  }
}
</style>

<template>
  <div class="center-rules">
    <el-form :inline="true" :model="form" class="title">
      <el-form-item label="终端名称：">
        <el-input v-model="form.name" placeholder="请输入终端名称" />
      </el-form-item>
      <!-- <el-form-item label="终端IP: ">
        <el-input v-model="form.ip" placeholder="请输入终端IP" />
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
            style="width: 200px"
            v-model="form.timeoffsetIpt"
            placeholder="请输入偏移量"
          />
          <el-select style="width: 100px" v-model="form.timeoffset" clearable>
            <div v-for="m in timeOffsetOptions" :key="m.value">
              <el-option :label="m.label" :value="m.value" />
            </div>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="时间点：">
        <el-date-picker
          v-model="form.timepoint"
          type="datetime"
          placeholder="请选择开始日期"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item> -->
      <div style="margin-top: -12px">
        <el-button type="primary" @click="getListFun">查询</el-button>
        <el-button type="default" @click="resetFun">重置</el-button>
      </div>
    </el-form>
    <div class="content">
      <div class="content-title">终端列表</div>
      <el-button style="margin: 20px" type="primary" @click="sendNodeFun"
        >下发</el-button
      >
      <!-- class="table-style" -->
      <TableWapper
        ref="tableRef"
        row-key="tableRefs"
        :colConfigs="colConfigs"
        :tableData="tableData"
      >

      <template #status>
        <el-table-column label="下发状态" v-slot="scope">
          <div :style="`color:${scope.row.status=='已下发'?'#00ff00':'#ff0000'}`">{{ scope.row.status }}</div>
        </el-table-column>
      </template>
        <template #option>
          <el-table-column label="操作" v-slot="scope">
            <el-button
              link
              type="primary"
              @click="relevanceManFun(scope.row._id)"
              >关联规则</el-button
            >
          </el-table-column>
        </template>
      </TableWapper>
      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="size"
          :page-sizes="pageSizes"
          :total="total"
          :pager-count="11"
          layout="total, prev, pager, next,sizes"
          @current-change="currentFun"
          @size-change="sizeChangeFun"
        />
      </div>
    </div>
    <RelevanceManDia ref="manDiaRef" />
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, toRefs } from "vue";
import TableWapper from "@/components/Table/index.vue";
import rulesManApi from "@/api/rulesMan";
import RelevanceManDia from "./RelevanceManDia.vue";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  name: "Manage",
  components: { TableWapper, RelevanceManDia },
  setup() {
    const state = reactive({
      tableRef: null,
      form: {
        name: "",
        // ip: "",
        // timearrows: "", //时间方向
        // severity: "", //告警等级
        // timeoffsetIpt: "", //时间偏移量(输入框)
        // timeoffset: "", //时间偏移量(下拉框)
        // timepoint: "", //时间点
      },
      manDiaRef: null, //关联规则ref
      diaRef: null,
      importRef: null,
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
      page: 1,
      total: 0,
      size: 10,
      pageSizes: [10, 20, 50, 100],
      colConfigs: [
        { slot: "selection" },
        { slot: "index" },
        { label: "终端名称", prop: "name" },
        { label: "终端地址", prop: "ip" },
        { label: "MAC地址", prop: "mac" },
        { label: "操作系统", prop: "os" },
        { label: "注册时间", prop: "createTime" },
        { slot: "status" },
        // { slot: "option" },
      ],
      tableData: [],
    });
    const funMethods = {
      resetFun() {
        state.form = {
          name: "",
          // ip: "",
          // timearrows: "", //时间方向
          // severity: "", //告警等级
          // timeoffsetIpt: "", //时间偏移量(输入框)
          // timeoffset: "", //时间偏移量(下拉框)
          // timepoint: "", //时间点
        };
      },
      currentFun(val) {
        state.page = val;
        // state.size = 10;
        requestMethods.getListFun();
      },
      sizeChangeFun(val) {
        state.size = val;
        state.page = 1;
        requestMethods.getListFun();
      },
      relevanceManFun(rowId) {
        state.manDiaRef.show(rowId);
      },
    };
    const requestMethods = {
      async sendNodeFun() {
        let newData = state.tableRef.getSelectionRows();
        if(newData.length == 0){
          ElMessageBox.alert("请选择左侧要下发的终端！", "提示", {
            confirmButtonText: "好的",
          });
          return
        }
        const payload = newData.map((m)=>{
          return {
            id:m._id,
            apiList:m.apiList
          }
        })
        const res = await rulesManApi.sendNode(payload);
        if(res == 200){
          ElMessage({
            message:'下发成功',
            type:"success",
          })
          state.tableRef.clearSelection()
        }
      },
      async getListFun() {
        const payload = {
          order: 2,
          page: 1,
          size: 20,
          sortname: "createTime",
          name: state.form.name,
          // reqIp: state.form.ip,
          // timearrows: state.form.timearrows,
          // timeoffset: state.form.timeoffsetIpt + state.form.timeoffset,
          // timepoint: state.form.timepoint,
        };
        const res = await rulesManApi.manList(payload);
        const newData = res.list.map((m) => {
          return {
            ...m,
            status: m.status == 0 ? "未下发" : "已下发",
          };
        });
        state.tableData = newData;
        state.total = res.total;
      },
    };

    onMounted(() => {
      state.form.name='';
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
.center-rules {
  .title {
    // margin-top: 10px;
    background-color: #05162f;
    height: 74px;
    display: flex;
    align-items: center;
    padding-left: 20px;
  }
  .content {
    min-height: 800px;
    background-color: #05162f;
    margin-top: 20px;
    .content-title {
      padding-top: 20px;
      margin-left: 20px;
      line-height: 20px;
      height: 20px;
      display: flex;
      &::before {
        content: "";
        display: inline-block;
        width: 4px;
        height: 20px;
        background: linear-gradient(to bottom, #0bcc9b 30%, #0248d1 70%);
        transition: background-image 5s;
        margin-right: 10px;
      }
    }
    .btns {
      margin-left: 20px;
      margin-top: 10px;
    }
    .table-style {
      margin-top: 20px;
      margin-left: 20px;
      // margin-right: 20px;
    }
  }
  .pagination {
    float: right;
  }
}
</style>

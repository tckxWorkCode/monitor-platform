<template>
  <div class="center-rules">
    <el-form :inline="true" :model="form" class="title">
      <el-form-item label="规则名称：">
        <el-input v-model="form.name" placeholder="请输入规则名称" />
      </el-form-item>
      <div style="margin-top: -12px">
        <el-button type="primary" @click="getListFun">查询</el-button>
        <el-button type="default" @click="resetFun">重置</el-button>
      </div>
    </el-form>
    <div class="content">
      <div class="content-title">规则列表</div>
      <div class="btns">
        <el-button type="primary" @click="importNodeFun">导入规则</el-button>
      </div>
      <!-- class="table-style" -->
      <TableWapper
        row-key="tableKey"
        :colConfigs="colConfigs"
        :tableData="tableData"
      >
        <template #severity>
          <el-table-column label="告警等级" v-slot="scope" width="150">
          <el-tag :style="`color:${colorEnum[scope.row.severity]};background-color:transparent`">{{ scope.row.severity }}</el-tag>
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
    <ImportRule ref="importRef" @onCompleted="getListFun" :ifCenter="false" />
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, toRefs } from "vue";
import TableWapper from "@/components/Table/index.vue";
import rulesManApi from "@/api/rulesMan";
import { triggerDownload } from "@/api/axios";
import ImportRule from "./ImportRule.vue";

export default {
  name: "NodeRules",
  components: { TableWapper, ImportRule },
  setup() {
    const state = reactive({
      form: {
        name: "",
      },
      importRef: null,
      page: 1,
      total: 0,
      size: 10,
      pageSizes: [10, 20, 50, 100],
      colConfigs: [
        { slot: "index" },
        { slot: "severity" },
        { label: "规则名称", prop: "name" },
        { label: "风险分数", prop: "riskscore" },
        { label: "版本号", prop: "version" },
        { label: "标签", prop: "tags" },
        { label: "更新时间", prop: "createTime" },
      ],
      tableData: [],
      levelType: {
        严重: "danger",
        高级: "warning",
        中级: "success",
        低级: "info",
      },
      colorEnum:{
        严重:'#FF0000',
        高级:'#FF9900',
        中级:'#FFFF00',
        低级:'#00FF00',
      },
    });
    const funMethods = {
      resetFun() {
        state.form.name = "";
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
    };
    const requestMethods = {
      async importNodeFun() {
        state.importRef.show();
      },
      async getListFun() {
        const payload = {
          order: 1,
          page: state.page,
          size: state.size,
          sortname: "createTime",
          name: state.form.name,
        };
        const res = await rulesManApi.nodeRulesList(payload);
        state.tableData = res.list;
        state.total = res.total;
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
      margin-bottom: 20px;
    }
    .table-style {
      margin-top: 20px;
      margin-left: 20px;
      margin-right: 20px;
    }
  }
  .pagination {
    float: right;
  }
}
// :deep(.el-tag) {
//   background-color: #053364;
//   color: #fff;
//   border: 1px solid #064889;
//   height: 30px;
//   margin-right: 4px;
//   margin-top: 2px;
// }
</style>

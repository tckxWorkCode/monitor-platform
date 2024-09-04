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
        <el-button type="primary" @click="createFun">创建规则</el-button>
        <el-button type="primary" @click="importFun">导入规则</el-button>
        <el-dropdown style="margin-left: 10px">
          <el-button type="primary"
            >批量操作<el-icon class="el-icon--right"><arrow-down /></el-icon
          ></el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="enabledFun(true)"
                >启用选中</el-dropdown-item
              >
              <el-dropdown-item @click="enabledFun(false)"
                >禁用选中</el-dropdown-item
              >
              <el-dropdown-item @click="delAllFun">删除选中</el-dropdown-item>
              <el-dropdown-item @click="exportRuleFun"
                >导出选中</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <!-- class="table-style" -->
      <TableWapper
        :colConfigs="colConfigs"
        :tableData="tableData"
        ref="tableRef"
        :row-key="'centerTable'"
      >
        <template #severity>
          <el-table-column label="告警等级" v-slot="scope" width="150">
          <el-tag :style="`color:${colorEnum[scope.row.severity]};background-color:transparent`">{{ scope.row.severity }}</el-tag>
        </el-table-column>
        </template>
        <template #enabled>
          <el-table-column label="状态" v-slot="scope">
            <el-switch
              v-model="scope.row.enabled"
              @change="changeSwitch(scope.row, scope.row.enabled)"
            ></el-switch>
          </el-table-column>
        </template>
        <template #tags>
          <el-table-column label="标签" v-slot="scope" width="340">
            <div style="display: flex; flex-direction: row">
              <div v-for="m in scope.row.tags">
                <el-tag v-if="m"> {{ m }} </el-tag>
              </div>
            </div>
          </el-table-column>
        </template>
        <template #option>
          <el-table-column label="操作" v-slot="scope">
            <el-button style="color: #00ff00;" link type="primary" @click="editFun(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              style="color: red"
              link
              type="danger"
              @click="clickDelFun(scope.row.id)"
              >删除</el-button
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
    <CreateDia ref="diaRef" @onCompleted="getListFun" />
    <ImportDia ref="importRef" @onCompleted="getListFun" :ifCenter="true"/>
    <DelRule ref="delRuleRef" @onCompleted="getListFun" />
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, toRefs } from "vue";
import TableWapper from "@/components/Table/index.vue";
import rulesManApi from "@/api/rulesMan";
import CreateDia from "./RuleCreate.vue";
import ImportDia from "./ImportRule.vue";
import DelRule from "./DelRule.vue";
import { triggerDownload } from "@/api/axios";
import { ElLoading, ElMessage, ElMessageBox } from "element-plus";
import "../index.scss";

export default {
  name: "CenterRules",
  components: { TableWapper, CreateDia, ImportDia, DelRule },
  setup() {
    const state = reactive({
      form: {
        name: "",
      },
      levelEnum: {
        1: "低级",
        2: "中级",
        3: "高级",
        4: "严重",
      },
      levelType: {
        高级: "danger",
        中级: "warning",
        严重: "success",
        低级: "info",
      },
       colorEnum:{
        严重:'#FF0000',
        高级:'#FF9900',
        中级:'#FFFF00',
        低级:'#00FF00',
      },
      flagStatus: false,
      diaRef: null,
      importRef: null,
      delRuleRef: null,
      tableRef: null,
      switchValue: false,
      page: 1,
      total: 0,
      size: 10,
      pageSizes: [10, 20, 50, 100],
      colConfigs: [
        { slot: "selection" },
        {slot:'index'},
        { slot: "severity" },
        { label: "规则名称", prop: "name" },
        { label: "规则类型", prop: "type" },
        { label: "风险分数", prop: "risk_score" },
        { label: "版本号", prop: "version" },
        { slot: "tags" },
        { label: "更新时间", prop: "updatedAt" },
        { slot: "enabled" },
        { slot: "option" },
      ],
      tableData: [],
      modelOption: [
        { value: "alert-a", label: "系统调用" },
        { value: "alert-b", label: "周期性" },
        { value: "trust-log", label: "可信" },
      ],
      modelEnum: {
        "alert-a": "系统调用",
        "alert-b": "周期性",
        "trust-log": "可信",
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
      createFun() {
        state.diaRef.show();
      },
      editFun(rowId: any) {
        state.diaRef.show(rowId);
      },
      importFun() {
        state.importRef.show();
      },
      // 弹出删除的确认框
      clickDelFun(rowId: any) {
        state.delRuleRef.show(rowId);
      },
      async changeSwitch(rowInfo: any, status: any) {
        const loading = ElLoading.service({
          lock: true,
          text: "正在修改状态, 请勿刷新页面",
          background: "rgba(0, 0, 0, 0.7)",
        });
        await rulesManApi.optEnable(
          [{ id: rowInfo.id, enabled: status }],
          () => {
            loading.close();
          }
        );
      },
    };
    const requestMethods = {
      async getListFun() {
        const payload = {
          order: 2,
          page: 1,
          size: 20,
          sortname: "updatedAt",
          name: state.form.name,
        };
        const res = await rulesManApi.centerRulesList(payload);
        state.tableData = res.list.map((m: any) => {
          return {
            ...m,
            type:m.type=='query'?"自定义规则":"阈值规则",
            index: state.modelEnum[m.index[0]],
          };
        });
        state.total = res.total;
      },
      async exportRuleFun() {
        const newData = state.tableRef.getSelectionKeys();
        if (newData.length == 0) {
          ElMessageBox.alert("请选择左侧要导出的规则！", "提示", {
            confirmButtonText: "好的",
          });
        } else {
          const res = await rulesManApi.exportRule(newData);
          triggerDownload(res,'ndjson');
          state.tableRef.clearSelection();
        }
        requestMethods.getListFun();
      },

      async enabledFun(enabled: any) {
        const newData = state.tableRef.getSelectionIdKeys();
        if (newData.length == 0) {
          ElMessageBox.alert("请选择左侧要操作的规则！", "提示", {
            confirmButtonText: "好的",
          });
        } else {
          const loading = ElLoading.service({
            lock: true,
            text: "正在操作规则, 请勿刷新页面",
            background: "#fff",
          });
          let newResult = newData.map((m: any) => {
            return {
              id: m,
              enabled: enabled,
            };
          });
          await rulesManApi.optEnable(newResult, () => {
            loading.close();
            state.tableRef.clearSelection();
            ElMessage.success("批量操作成功！");
          });
        }
        requestMethods.getListFun();
      },
      async delAllFun() {
        let newData = state.tableRef.getSelectionIdKeys();
        if (newData.length == 0) {
          ElMessageBox.alert("请选择左侧要删除的规则！", "提示", {
            confirmButtonText: "好的",
          });
        } else {
          let newResult = newData.map((m: any) => {
            return {
              id: m,
            };
          });
          const loading = ElLoading.service({
            lock: true,
            text: "正在删除规则, 请勿刷新页面",
            background: "#fff",
          });
          const res = await rulesManApi.delRule(newResult, () => {
            loading.close();
          });
          if (res == 200) {
            state.tableRef.clearSelection();
            ElMessage.success("批量删除成功！");
          }
        }
        requestMethods.getListFun();
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
.el-button.is-text:not(.is-disabled):focus,
.el-button.is-text:not(.is-disabled):hover {
  background-color: transparent;
}

.el-dropdown__popper .el-dropdown-menu {
  background-color: #012e5a;
  color: #fff;
}
:deep(.el-dropdown-menu__item) {
  color: #fff;
}
:deep(.el-dropdown-menu__item:hover) {
  color: #fff;
  background-color: #05519a;
}
// :deep(.el-loading-spinner .el-loading-text){
//   color: #fff;
// }
// :deep(.el-tag) {
//   background-color: #053364;
//   color: #fff;
//   border: 1px solid #064889;
//   height: 30px;
//   margin-right: 4px;
//   margin-top: 2px;
// }
</style>

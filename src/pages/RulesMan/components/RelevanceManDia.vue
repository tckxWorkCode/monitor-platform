<template>
  <div>
    <el-dialog v-model="visible" title="关联规则">
      <TableWapper :colConfigs="colConfigs" :tableData="tableData">
        <template #state>
          <el-table-column label="是否启用" v-slot="scope" width="100">
            <el-switch
              @change="changeSwitchFun(scope.row)"
              v-model="scope.row.state"
              style="
                --el-switch-on-color: #13ce66;
                --el-switch-off-color: #a4a4a4;
              "
            ></el-switch>
          </el-table-column>
        </template>
      </TableWapper>
      <template #footer>
        <el-button @click="hide">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs } from "vue";
import TableWapper from "@/components/Table/index.vue";
import ruleManApi from "@/api/rulesMan";
import { ElMessage } from "element-plus";
export default {
  name: "RelevanceManDialog",
  components: { TableWapper },
  setup() {
    const state = reactive({
      visible: false,
      enable: true,
      tableData: [],
      colConfigs: [
        { slot: "index" },
        { label: "告警等级", prop: "severity" },
        { label: "规则名称", prop: "name" },
        { label: "版本号", prop: "version" },
        { label: "标签", prop: "tags" },
        { label: "下发时间", prop: "createTime" },
        { slot: "state" },
      ],
      rowId: "",
    });
    const funMethods = {
      show(rowId) {
        if (rowId) {
          state.rowId = rowId;
          state.visible = true;
          requestMethods.getList();
        }
      },
      hide() {
        state.visible = false;
      },
    };
    const requestMethods = {
      // 获取关联规则的列表
      async getList() {
        const formData = new FormData();
        formData.append("id", state.rowId);
        const res = await ruleManApi.relevanceList(formData, () => {});
        const newData = res.map((m) => {
          return {
            ...m,
            state: m.state == 1 ? true : false, //1启用 true  0停用 false
          };
        });
        state.tableData = newData;
      },

      //关联规则的状态
      async changeSwitchFun(rowInfo) {
        // 1启用 true  0 停用 false
        const payload = {
          id: state.rowId,
          ids: [rowInfo.id],
          status: rowInfo.state == true ? 1 : 0,
        };
        const res = await ruleManApi.ruleStateswitch(payload);
        if (res == 200) {
          ElMessage({ message: "操作成功", type: "success"});
          funMethods.hide();
        }
      },
    };

    return {
      ...toRefs(state),
      ...funMethods,
      ...requestMethods,
    };
  },
};
</script>

<style lang="scss" scoped></style>

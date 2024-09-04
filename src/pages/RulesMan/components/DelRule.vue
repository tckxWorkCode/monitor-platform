<template>
  <div class="import-rules">
    <el-dialog
      v-model="dialogVisible"
      title="删除"
      width="610px"
      >
      <!-- :before-close="close"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      v-loading="loading" -->
      <div class="content">
        <div class="conX">X</div>
        <div style="font-size: 18px">删除后无法恢复, 请确认</div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button :disabled="loading" @click="close">取消</el-button>
          <el-button :disabled="loading" type="danger" @click="submitFun">
            确认并删除
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import ruleMan from "@/api/rulesMan/index";
import { ElMessage,ElLoading } from "element-plus";
import "../index.scss";

export default {
  name: "DelRule",
  emits: ["onCompleted"],
  setup(props, { emit }) {
    const state = reactive({
      dialogVisible: false,
      rowId: "",
      loading: false,
    });
    const funMethods = {
      close() {
        state.dialogVisible = false;
      },
      show(rowId) {
        state.dialogVisible = true;
        state.rowId = rowId;
      },
    };
    const requestMethods = {
      async submitFun() {
        const loading = ElLoading.service({
            lock: true,
            text: "正在删除规则, 请勿刷新页面",
            // background: "gray",
          });
        const res = await ruleMan.delRule([{ id: state.rowId }], () => {
          // state.loading = false;
          loading.close();
        });
        if (res == 200) {
          ElMessage({
            message: "删除成功",
            type: "success",
          });
          state.dialogVisible = false;
          emit("onCompleted");
          return;
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

<style scoped>
.import-rules {
  .content {
    text-align: center;
    color: #fff;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .conX {
      background-color: #f56c6c;
      height: 25px;
      width: 25px;
      text-align: center;
      line-height: 25px;
      border-radius: 50%;
      margin-right: 20px;
    }
    .bottom-tip {
      color: #fff;
      margin-top: 40px;
    }
  }
}

:deep(.el-button--danger) {
  background-color: #f56c6c;
  &:hover {
    background-color: #f56c6c;
  }
}
</style>

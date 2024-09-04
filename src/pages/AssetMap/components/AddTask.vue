<template>
  <div>
    <el-dialog
      style="min-height: 50vh; height: 50vh; max-height: 50vh"
      v-model="visible"
      :close-on-click-modal="false"
      @close="hide"
      title="新增任务"
    >
      <el-steps :active="active">
        <!-- finish-status="success" -->
        <el-step title="基础信息" />
        <el-step title="搜索配置" />
        <el-step title="汇总" />
      </el-steps>
      <el-form :model="form" :rules="rules" style="margin-top: 10px;max-height: 30vh;overflow-y: auto;">
        <div v-show="active == 1">
          <el-form-item label="名称: " prop="name">
            <el-input v-model="form.name" clearable placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="执行类型: ">
            <el-radio-group v-model="radio">
              <el-radio :label="1">定期执行</el-radio>
              <el-radio :label="2">周期执行</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="时间: " prop="time">
            <el-date-picker
              @change=""
              v-model="form.time"
              type="datetimerange"
              value-format="YYYY-MM-DD HH:mm:ss"
              range-separator="~"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item label="描述: ">
            <el-input
              type="textarea"
              v-model="form.desc"
              clearable
              placeholder="请输入描述"
            />
          </el-form-item>
        </div>
        <div v-show="active == 2">
          <div>
            <div class="title-task">搜索配置</div>
            <el-divider/>
            <el-form-item label="扫描目标" prop="target"><el-input v-model="form.target" placeholder="请输入扫描目标"/></el-form-item>
            <el-form-item label="执行类型: ">
              <el-radio-group v-model="radioConfig">
                <el-radio :label="1">快速嗅探</el-radio>
                <el-radio :label="2">深度嗅探</el-radio>
                <el-radio :label="3">智能嗅探</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div>
            <div class="title-task">探针配置</div>
            <el-divider/>
            <TableWapper :colConfigs="colConfigs" :tableData="tableData" />
          </div>
          <div>
            <div class="title-task">扫描模式</div>
            <el-divider/>
            <el-radio-group v-model="scanModel">
              <el-radio :label="1">系统扫描</el-radio>
              <el-radio :label="2">用户自定义</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div v-show="active==3">
          <div class="title-task">探索信息</div>
          <el-divider/>
          <div class="title-task">扫描信息</div>
          <el-divider/>
          <div class="title-task">探针信息</div>
          <el-divider/>
          <div class="title-task">扫描模式</div>
          <el-divider/>
        </div>
      </el-form>
      <template #footer>
        <el-button v-if="active == 2 || active == 3" @click="active--" >上一页</el-button >
        <el-button type="primary" v-if="active == 1 || active == 2" @click="active++" >下一页</el-button >
        <el-button type="primary" v-if="active == 3" @click="submitFun" >完成</el-button >
        <el-button @click="hide">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { FormRules } from "element-plus";
import { reactive, toRefs } from "vue";
import TableWapper from "@/components/Table/index.vue";
export default {
  name: "AddTask",
  components: { TableWapper },
  setup() {
    const state = reactive({
      visible: false,
      active: 1,
      radioConfig:4,
      scanModel:1,
      radio: 1,
      form: {
        name: "",
        time: "",
        desc: "",
        target:"",
      },
      colConfigs: [
        { slot: "selection" },
        { label: "名称", prop: "name" },
        { label: "MAC地址", prop: "mac" },
        { label: "IP", prop: "ip" },
        { label: "归属省份", prop: "province" },
        { label: "状态", prop: "status" },
        { label: "类型", prop: "type" },
        { label: "创建时间", prop: "createTime" },
      ],
      tableData: [],
    });
    const rules = reactive<FormRules>({
      name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      time: [{ required: true, message: "请选择时间", trigger: "blur" }],
      target: [{ required: true, message: "请输入扫描目标", trigger: "blur" }],
    });
    const funMethods = {
      show() {
        state.visible = true;
        state.active = 1;
      },
      hide() {
        state.visible = false;
        state.active = 1;
      },
    };
    const requestMethods = {
      // 新增任务
      async submitFun() {},
    };

    return {
      rules,
      ...toRefs(state),
      ...funMethods,
      ...requestMethods,
    };
  },
};
</script>

<style lang="scss" scoped>
.el-button,
.el-button:hover {
  background-color: #012e5a;
  border: 1px solid #012e5a;
  color: #fff;
}

:deep(.el-textarea__inner) {
  background-color: transparent;
  box-shadow: none;
  border: 1px solid #024b93;
  border-radius: 6px;
}

:deep(.el-form-item__label) {
  width: 100px;
}

.el-button--primary,
.el-button--primary:hover {
  background-color: #118cfe;
  border: 1px solid #118cfe;
  color: #fff;
}

.title-task{
  color: #fff;
  font-size: 16px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  &::before{
    content: '';
    display: inline-block;
    width: 4px;
    height: 20px;
    margin-right: 15px;
    background-image: linear-gradient(to bottom, #685bf1, #5266ca);
  }
}

:deep(.el-dialog__footer) {
  right: 0;
  bottom: 0px;
  width: 100%;
  position: absolute;
}
:deep(.el-step__title.is-process) {
  color: #fff !important;
}
:deep(.el-step__title.is-wait) {
  color: #fff !important;
}
:deep(.el-radio){
  color: #fff;
  font-size: 16px !important;
}
</style>

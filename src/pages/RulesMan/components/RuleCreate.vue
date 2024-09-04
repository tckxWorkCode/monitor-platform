<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :title="title"
      width="900"
      :before-close="close"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <div class="content" style="overflow-y: auto">
        <el-form
          style="max-width: 100%; display: flex; flex-direction: column"
          ref="formRef"
          :rules="rulesForm"
          label-width="auto"
          :model="formData"
        >
          <el-form-item label="规则类型">
            <el-radio-group v-model="formData.radio" @change="changeRadioFun">
              <el-radio-button label="自定义规则" value="自定义规则" />
              <el-radio-button label="阈值规则" value="阈值规则" />
            </el-radio-group>
          </el-form-item>
          <!-- 匹配模式 -->
          <el-form-item label="匹配模式" prop="index">
            <el-select v-model="formData.index">
              <el-option
                v-for="item in modelOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <!-- v-show="formData.add.length == 0" -->
          <!-- <el-button type="primary" link @click="addFun">
            <el-icon style="margin-right: 5px"><Plus /></el-icon
            >添加规则组</el-button
          > -->
          <!-- v-if="formData.add.length > 0" -->
          <el-form-item label="匹配规则">
            <!-- prop="matchRule" -->

            <div class="add-style">
              <el-form-item
                v-for="(domain, index) in formData.add"
                :key="domain.key"
                label=""
                :prop="'domains.' + index + '.value'"
              >
                <!-- :rules="{
                required: true,
                message: '请输入规则',
                trigger: 'change',
              }" -->
                <div class="ruleStyle">
                  <el-select
                    style="margin-left: 100px"
                    v-model="domain.value"
                    placeholder="请选择"
                    @change="changeSelectFun"
                  >
                    <el-option
                      v-for="item in warnOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <el-select
                    style="width: 100px"
                    v-model="domain.value1"
                    placeholder="请选择"
                  >
                    <el-option label="==" value=":" />
                    <el-option v-if="ifShow == true" label=">=" value=">=" />
                    <el-option v-if="ifShow == true" label="<=" value="<=" />
                  </el-select>
                  <el-input
                    style="width: 180px"
                    v-if="ifShow == true"
                    v-model="domain.value2"
                    placeholder="请输入"
                  />
                  <el-select
                    v-else
                    v-model="domain.value2"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in sysOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <div class="addDemo" @click="addFun">+</div>
                  <div class="delDemo" @click="removeFun(domain)">-</div>
                </div>
              </el-form-item>
              <el-button type="primary" link @click="addFun">
                <el-icon style="margin-right: 5px"><Plus /></el-icon
                >添加规则组</el-button
              >
            </div>
            <div v-show="ifShowTime" style="display: flex; flex-direction: row">
              <el-form-item label="时间范围">
                <el-time-picker
                  v-model="formData.timeRange"
                  is-range
                  value-format="HH"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  @change="timePickerFun"
                />
              </el-form-item>
              <el-form-item label="智能屏蔽数据" style="margin-left: 20px">
                <el-radio-group v-model="formData.isContain">
                  <el-radio-button label="包含" value="包含" />
                  <el-radio-button label="不包含" value="不包含" />
                </el-radio-group>
              </el-form-item>
            </div>
          </el-form-item>
          <!-- 阈值规则的计数 -->
          <div v-if="ifShowCompute">
            <div style="color: #fff; margin-left: 10px">计数</div>
            <div class="computeStyle">
              <el-from-item>
                <el-select v-model="compute.type" placeholder="请选择计数类型">
                  <el-option
                      v-for="item in warnOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                </el-select>
                <el-select style="margin-left: 10px;"v-model="compute.center">
                  <el-option label="==" value="=="/>
                </el-select>
                <el-input v-model="compute.input" style="width: 359px;margin-left: 10px;" placeholder="请输入数量" />
              </el-from-item>
            </div>
          </div>
          <!-- 以上阈值规则的计数 -->
          <el-divider />
          <el-form-item label="规则名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入规则名称" />
          </el-form-item>
          <el-form-item label="告警原因" prop="description">
            <el-input
              v-model="formData.description"
              type="textarea"
              placeholder="请输入告警原因, 段落中必须含有^$, 且顺序^前$后"
            />
          </el-form-item>
          <el-form-item label="告警等级" prop="severity">
            <el-select
              v-model="formData.severity"
              placeholder="请选择"
              style="width: 100%"
              @change="changeSeverityFun"
            >
              <el-option
                v-for="item in levelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="风险分数" prop="risk_score">
            <el-slider v-model="formData.risk_score" show-input />
          </el-form-item>
          <el-form-item label="作者">
            <el-input v-model="formData.author" placeholder="请输入作者名称" />
          </el-form-item>
          <el-form-item label="标签">
            <div style="display: flex; flex-direction: row; flex-wrap: wrap">
              <el-tag
                :key="tag"
                v-for="tag in dynamicTags"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                style="width: 300px"
                v-model="formData.tags"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
                placeholder="请输入新标签"
              />
            </div>
          </el-form-item>
          <el-divider />
          <el-form-item label="运行周期" prop="zhou">
            <el-input v-model="formData.zhou" style="width: 300px" />
            <span class="left">分钟</span>
            <span class="right"
              >注: 规则定期运行并再指定时间范围内检测报警.</span
            >
          </el-form-item>
          <el-form-item label="回顾时间" prop="time">
            <el-input v-model="formData.time" style="width: 300px" />
            <span class="left">分钟</span>
            <span class="right">注: 增加回顾周期时间, 以防止错过报警.</span>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button :disabled="loading" @click="close">取消</el-button>
          <el-button
            :disabled="loading"
            type="primary"
            @click="submitFun(formRef)"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { ElLoading, ElMessage, FormInstance, FormRules } from "element-plus";
import { onMounted, reactive, toRefs } from "vue";
import { Search } from "@element-plus/icons-vue";
import ruleManApi from "@/api/rulesMan/index";

export default {
  name: "RulesCreate",
  emits: ["onCompleted"],
  setup(props, { emit }) {
    const levelOptions = [
      { label: "低级", value: "low" },
      { label: "中级", value: "medium" },
      { label: "高级", value: "high" },
      { label: "严重", value: "critical" },
    ];

    const state = reactive({
      dialogVisible: false,
      ifShowCompute: false,
      loading: false,
      levelOptEnum: {
        低级: "low",
        中级: "medium",
        高级: "high",
        严重: "critical",
      },
      levelEnum: {
        low: 21,
        medium: 47,
        high: 73,
        critical: 99,
      },
      dynamicTags: [],
      modelOption: [
        { value: "alert-a", label: "实时关联预警" },
        { value: "alert-b", label: "状态监测预警" },
        { value: "trust-log", label: "基础可信预警" },
      ],
      modelEnum: {
        "alert-a": "实时关联预警",
        "alert-b": "状态监测预警",
        "trust-log": "基础可信预警",
      },
      typeTwoEnum: {
        "1": "白名单hash校验失败",
        "2": "关键文件hash校验失败",
        "3": "程序执行失败",
        "4": "动态度量失败",
        "5": "启动度量失败",
        "6": "可信接入失败",
        "7": "文件访问失败",
        "8": "外设失败",
        "9": "网络失败",
      },
      reTypeTwoEnum: {
        白名单hash校验失败: "1",
        关键文件hash校验失败: "2",
        程序执行失败: "3",
        动态度量失败: "4",
        启动度量失败: "5",
        可信接入失败: "6",
        文件访问失败: "7",
        外设失败: "8",
        网络失败: "9",
      },
      levelOptions,
      formRef: null,
      radio: "自定义规则",
      warnOptions: [],
      sysOptions: [],
      compute:{
        type:'',
        center:'==',
        input:'',
      },
      formData: {
        name: "",
        index: "",
        description: "",
        severity: "",
        risk_score: "",
        add: [],
        author: "",
        tags: "",
        zhou: "1",
        time: "5",
        radio: "自定义规则",
        timeRange: "",
        isContain: "",
        matchRule: "",
      },
      ifShow: false,
      ifShowTime: false,
      rowId: "",
      title: "创建规则",
    });

    const rulesForm: FormRules = {
      name: [{ required: true, message: "请输入规则名称", trigger: "blur" }],
      description: [
        { required: true, message: "请输入告警原因", trigger: "blur" },
      ],
      severity: [
        { required: true, message: "请选择告警等级", trigger: "change" },
      ],
      index: [{ required: true, message: "请选择匹配模式", trigger: "change" }],
      risk_score: [
        { required: true, message: "请输入告警原因", trigger: "blur" },
      ],
      zhou: [{ required: true, message: "请输入告警原因", trigger: "blur" }],
      time: [{ required: true, message: "请输入分钟", trigger: "blur" }],
      // radio: [{ required: true, message: "请输入规则", trigger: "blur" }],
      // matchRule: [{ required: true, message: "请输入规则", trigger: "change" }],
    };
    const funMethods = {
      changeSelectFun(val: any) {
        if (val == "type") {
          state.ifShow = false;
          requestMethods.getSecondSelectFun(val);
        } else {
          state.ifShow = true;
          // state.formData.add[0].value2 = '';
        }
      },
      handleClose(tag: any) {
        state.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },
      handleInputConfirm() {
        if (state.formData.tags) {
          state.dynamicTags.push(state.formData.tags);
          state.formData.tags = "";
        }
      },
      show(rowId?: any) {
        state.ifShowTime = false;
        state.dialogVisible = true;
        state.ifShowCompute = false;
        state.dynamicTags = [];
        state.compute={
          input:'',
          type:"",
          center:"",
        }
        if (rowId) {
          // 编辑规则
          state.rowId = rowId;
          requestMethods.getDetailInfo();
          state.title = "编辑规则";
        } else {
          // 创建规则
          requestMethods.getFirstSelectFun();
          state.title = "创建规则";
        }
      },
      timePickerFun(val: any) {
        if (val) {
          state.formData.isContain = "包含";
        }
      },
      close() {
        state.dialogVisible = false;
        state.ifShow = false;
        state.rowId = "";
        state.formData = {
          index: "",
          name: "",
          description: "",
          severity: "",
          risk_score: "",
          add: [],
          author: "",
          tags: "",
          zhou: "1",
          time: "5",
          radio: "自定义规则",
          timeRange: "",
          isContain: "",
          matchRule: "",
        };
      },
      addFun() {
        if (state.rowId) {
          state.formData.add = [];
        }
        state.ifShowTime = true;
        state.formData.add.push({
          key: Date.now(),
          value: "",
        });
      },
      removeFun(item: any) {
        const index = state.formData.add.indexOf(item);
        if (index !== -1) {
          state.formData.add.splice(index, 1);
        }
      },
      changeSeverityFun(val: any) {
        state.formData.risk_score = state.levelEnum[val];
      },
      changeRadioFun(val: any) {
        if (val == "阈值规则") {
          state.ifShowCompute = true;
        } else {
          state.ifShowCompute = false;
        }
      },
    };
    const requestMethods = {
      // 根据id获取编辑信息
      async getDetailInfo() {
        const res = await ruleManApi.detailInfo(state.rowId);
        state.formData = {
          ...res,
          zhou: res.interval.slice(0, -2),
          time: res.lookBackTime.slice(0, -2),
          radio: "自定义规则",
          index: res.index.toString(),
          tags: "",
          author: res.author.toString(),
          severity: state.levelOptEnum[res.severity],
        };
        state.dynamicTags = res.tags;
        if (res.query.indexOf("alert_score") == 1) {
          state.ifShow = true;
          state.formData.add = [
            {
              value: "告警分数",
              value1:
                res.query.slice(-6, -4) == " :"
                  ? "=="
                  : res.query.slice(-6, -4),
              value2: res.query.slice(-3, -1),
            },
          ];
        } else if (res.query.indexOf("type") == 1) {
          requestMethods.getFirstSelectFun();
          requestMethods.getSecondSelectFun("type");
          state.ifShow = false;
          state.formData.add = [
            {
              value: "告警类型",
              value1:
                res.query.slice(-4, -3) == ":" ? "==" : res.query.slice(-4, -3),
              value2: state.typeTwoEnum[res.query.slice(-2, -1)],
            },
          ];
        }
      },

      // 提交创建规则内容
      async submitFun(formEl: FormInstance | undefined) {
        await formEl?.validate(async (valid: boolean) => {
          if (!valid) {
            return;
          }
          let newQueryItem: any = "";
          newQueryItem = state.formData.add.map((m, i) => {
            if (m.value == "告警类型") {
              return (
                "(" +
                "type" +
                " " +
                m.value1 +
                " " +
                state.reTypeTwoEnum[m.value2] +
                ")"
              );
            } else if (m.value == "告警分数") {
              return (
                "(" + "alert_score " + " " + m.value1 + " " + m.value2 + ")"
              );
            }
            return "(" + m.value + " " + m.value1 + " " + m.value2 + ")";
          });

          // state.loading = true;
          let payload: any = {
            ...state.formData,
            index: state.ifShowCompute?["alertidx"]:[state.formData.index],
            language: "kuery",
            filters: [],
            false_positives: [],
            references: [],
            risk_score_mapping: [],
            severity_mapping: [],
            threat: [],
            license: "",
            from: "now-360s",
            to: "now",
            actions: [],
            throttle: "no_actions",
            enabled: true,
            meta: {
              from: state.formData.time + "m",
              kibana_siem_app_url: "http://kbn:5601/app/security",
            },
            isContain:
              state.formData.isContain == "包含"
                ? ""
                : state.formData.isContain,
            author: [state.formData.author],
            interval: state.formData.zhou + "m",
            start: state.formData.timeRange
              ? parseInt(state.formData.timeRange[0])
              : "",
            end: state.formData.timeRange
              ? parseInt(state.formData.timeRange[1])
              : "",
            type: state.ifShowCompute ?"threshold":"query",
            query: newQueryItem[0], //规则
            tags: state.dynamicTags,
            
          };

          if (state.rowId) {
            payload.id = state.rowId;
          }

          delete payload.time;
          delete payload.zhou;
          delete payload.timeRange;
          delete payload.radio;
          delete payload.add;
          delete payload.matchRule;
          if (state.rowId) {
            delete payload.createdAt;
            delete payload.created_at;
            delete payload.created_by;
            delete payload.exceptions_list;
            delete payload.immutable;
            delete payload.last_success_at;
            delete payload.last_success_message;
            delete payload.lookBackTime;
            delete payload.max_singals;
            delete payload.output_index;
            delete payload.rule_id;
            delete payload.updatedAt;
            delete payload.updated_at;
            delete payload.updated_by;
            delete payload.version;
          }
          const loading = ElLoading.service({
            lock: true,
            text: "正在提交规则, 请勿刷新页面",
            // background: "gray",
          });

          if(state.ifShowCompute==true){
            payload.threshold={
              field:state.compute.type,
              value:parseInt(state.compute.input),
              cardinality:[],
            }

            delete payload.end,
            delete payload.isContain,
            delete payload.start
          }
          const res = await ruleManApi.createRule(payload, () => {
            loading.close();
          });
          
          if (res == 200) {
            ElMessage({
              message: state.rowId ? "更新规则成功" : "新建规则成功",
              type: "success",
            });
            emit("onCompleted");
            state.dialogVisible = false;
            funMethods.close();
          }
        });
      },

      // 获取第一个下拉框内容
      async getFirstSelectFun() {
        const res = await ruleManApi.firstSelect({});
        const newData = res.map((m: any) => {
          let newObj = m;
          let twoObj = {
            label: newObj[Object.keys(newObj)[0]],
            value: Object.keys(newObj)[0],
          };
          return twoObj;
        });
        state.warnOptions = newData;
      },

      //获取第二个下拉框内容
      async getSecondSelectFun(value: any) {
        if (value != "type") {
          return;
        }
        const res = await ruleManApi.secondSelect({ field: value });
        const newData = res.map((m: any) => {
          let newObj = m;
          let twoObj = {
            label: newObj[Object.keys(newObj)[0]],
            value: Object.keys(newObj)[0],
          };
          return twoObj;
        });
        state.sysOptions = newData;
      },
    };

    return {
      Search,
      rulesForm,
      ...toRefs(state),
      ...funMethods,
      ...requestMethods,
    };
  },
};
</script>

<style lang="scss" scoped>
.content {
  height: 650px;
  overflow-y: auto;
  .left {
    margin-left: 4px;
  }
  .right {
    margin-left: 100px;
  }
  .add-style {
    background-color: #041b38;
    border: 1px solid #06315f;
    padding-top: 30px;
    width: 96%;
    margin-left: 2%;
    text-align: center;
    padding-bottom: 20px;
    margin-bottom: 20px;
  }
  .addDemo {
    background-color: #0c3e4e;
    color: #01e8f6;
    font-size: 20px;
    width: 24px;
    height: 24px;
    text-align: center;
    margin-left: 60px;
    margin-top: 5px;
    line-height: 24px;
    &:hover {
      cursor: pointer;
    }
  }
  .delDemo {
    background-color: #300e05;
    color: #990703;
    font-size: 20px;
    width: 24px;
    height: 24px;
    margin-left: 10px;
    margin-top: 5px;
    text-align: center;
    line-height: 24px;
    &:hover {
      cursor: pointer;
    }
  }

  .ruleStyle {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
}

:deep(.el-textarea__inner) {
  color: #fff;
}

:deep(.el-date-editor .el-range-input) {
  color: #fff;
}

.el-time-range-picker__content {
  background-color: #012e5a;
}

:deep(.el-loading-text) {
  color: #fff;
}

:deep(.el-input-number__decrease) {
  border-right: 1px solid #024b93;
}

:deep(.el-input-number__increase) {
  border-left: 1px solid #024b93;
}

:deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-left: 1px solid #024b93;
}

.computeStyle {
  background-color: #061f35;
  border: 1px solid #0b4c65;
  padding: 10px;
  margin: 20px 10px -10px 10px;
  height: 60px;
}
// :deep(.el-radio-button__original-radio:disabled+.el-radio-button__inner){
//   background-color: gray;
// }
</style>

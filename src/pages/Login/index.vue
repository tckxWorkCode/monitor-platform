<template>
  <div class="login">
    <div class="header">
      <el-image
        style="height: 90px"
        :src="require('@/assets/login/logo1.png')"
      />
      <div class="font-title">智能数字免疫平台</div>
    </div>
    <el-form
      :model="form"
      label-width="120px"
      :rules="rules"
      ref="formRef"
      hide-required-asterisk
      style="margin-left: -134px;display: flex;flex-direction: column;margin-top: 40px;"
    >
      <el-form-item prop="account">
        <el-input v-model="form.account" placeholder="请输入用户名" clearable />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          show-password
          type="password"
          v-model="form.password"
          placeholder="密码"
          clearable
          @keyup.enter="login(formRef)"
          oncut="return false"
          onpaste="return false"
          oncopy="return false"
        />
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          type="text"
          v-model="form.code"
          placeholder="请输入验证码"
          style="width: 360px"
          clearable
          @keyup.enter="login(formRef)"
        />
        <div class="input-vercode" @click="getCodeFun">
          <div v-if="!imgUrl"></div>
          <el-image
            style="width: 100px; height: 40px; border-radius: 8px"
            v-else
            :src="imgUrl"
          />
        </div>
      </el-form-item>
    </el-form>
    <el-button
      :loading="loading"
      :disabled="loading"
      class="login-button"
      type="primary"
      @click="login(formRef)"
      >登录</el-button
    >
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, ref, toRefs } from "vue";
import LoginApi from "@/api/login";
import { encryptionMd5 } from "@/utils";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { useRouter } from "vue-router";
import { userAuthSet } from "@/utils/security";
export default {
  name: "Login",
  setup() {
    const formRef = ref<FormInstance>();
    const router = useRouter();
    const state = reactive({
      loading: false,
      imgUrl: "",
      codeKey: "",
      cid: "",
      form: {
        account: "", //用户名
        password: "", //密码
        code: "",
        cid: "",
      },
    });

    const rules = reactive<FormRules>({
      account: [{ required: true, message: "请输入用户名" }],
      password: [
        { required: true, message: "请输入密码" },
        // { min: 6, message: "密码长度不能低于6位" },
        // { pattern: regex.noCn, message: "密码不能包含中文" },
      ],
      code: [
        { required: true, message: "请输入验证码" },
        // { pattern: regex.onlyNumber, message: "只能输入数字" },
      ],
    });

    onMounted(() => {
      requestMethods.getCodeFun();
      sessionStorage.removeItem("token");
    });

    const funMethods = {};
    const requestMethods = {
      // 获取验证码
      async getCodeFun() {
        const res: any = await LoginApi.getLoginCode();
        state.form.cid = res.cId;
        state.imgUrl = res.imageData;
      },
      async login(formEl: FormInstance | undefined) {
        await formEl?.validate(async (valid, fields) => {
          if (valid) {
              // 调登录的接口
              var payload = {
                ...state.form,
                password: encryptionMd5(state.form.password),
              };
              state.loading = true;
              const loginData: any = await LoginApi.userLogin(payload, () => {
                state.loading = false;
              });
              if(loginData.code == 1002 || loginData.code == 1001){
                requestMethods.getCodeFun()
                state.form.code = ''
                return 
              }
              
              // //登录成功设置auth信息
              userAuthSet(loginData.token);

              sessionStorage.setItem("sid", loginData.sid);
              sessionStorage.setItem("uid", loginData.uid);
              sessionStorage.setItem("uname", loginData.uname);
              //提示登陆成功
              ElMessage.success("登录成功");
              //跳转到对应首页
              // router.push(currentUserMenu()[0].path);
              router.push("/home");
          }
        });
      },
    };

    return {
      ...toRefs(state),
      rules,
      formRef,
      ...funMethods,
      ...requestMethods,
    };
  },
};
</script>

<style lang="scss" scoped>
:deep(.el-input__wrapper) {
    // opacity: 0.6;
    background-color: transparent;
    width: 450px;
    color: #fff !important;
    height: 43px;
    border: 1px solid #1480f0;
    box-shadow:none;
    &:hover{
        box-shadow:none;
        // box-shadow: 0px 0px 1px 1px rgb(20 128 240 / 90%);
        // border-color: transparent;
    }
}

:deep(.el-input__inner){
    color: #fff;
}
.login {
  height: 100vh;
  width: 100%;
  background-image: url("@/assets/login/back.png");
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  

  .header {
    // position: fixed;
    margin-top: -260px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .font-title {
      margin-top: 40px;
      font-size: 48px;
      font-weight: bold;
      color: #fff;
      letter-spacing: 0.3em;
      font-family: "Microsoft YaHei", 微软雅黑, sans-serif;
    }
  }

  .login-button {
    height: 47px;
    width: 480px;
    margin-top: 20px;
    margin-left: -20px;
    // margin-left: 114px;
    background-color: #108cfe;
    border-radius: 6px;
    opacity: 1;
    font-size: 18px;
  }

  .input-vercode {
    height: 40px;
    // width: 130px;
    margin-left: 10px;
    // border: 1px solid #00cc99;
    // background-color: #808080;
    border-radius: 8px;
    color: #fff;

    &:hover {
      cursor: pointer;
    }

    .el-input__wrapper {
      background-color: transparent;
    }
  }

  .el-form-item__content {
    background-color: transparent !important;
  }
}
</style>

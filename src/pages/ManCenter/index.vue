<template>
  <div class="man-center"></div>
</template>

<script lang="ts">
import { onMounted, reactive, toRefs } from "vue";
import manCenterApi from "@/api/manCenter";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { getManageUrl } from "@/config/index";

export default {
  name: "ManCenter",
  setup() {
    const state = reactive({});
    const router = useRouter();
    const funMethods = {};
    const requestMethods = {
      async authUser() {
        // 跳转管理中心之前先验证用户是否存在
        const res = await manCenterApi.authUserSafe({});
        const params1 = sessionStorage.getItem("sid");
        const params2 = sessionStorage.getItem("token");
        const params3 = sessionStorage.getItem("uname");
        if (res.code == 0) {
          // 此跳转路径是为了携带参数     
          return window.open(`${res.socUrl}/#/login?sid=${params1}&token=${params2}&username=${params3}`,"_self");
          // return window.open( `http://192.168.0.235:5000/#/login?sid=${params1}&token=${params2}&username=${params3}`,"_self" );
        } else {
          return router.push("home");
        }
      },
    };
    onMounted(() => {
      requestMethods.authUser();
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
.man-center {
  height: calc(100vh - 100px);
  width: calc(100%);
  background-image: url("../../assets/bigScreen/menu/backImg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  color: #fff;
}
</style>

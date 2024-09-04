<template>
  <div class="asset-map">
    <!-- <el-tabs v-model="tabName" type="border-card" @changeTab="changeTabFun">
      <el-tab-pane label="智能发现" name="intelFind">
        <IntelFind />
      </el-tab-pane>
      <el-tab-pane label="探索发现" name="exploreFind">
        <ExploreFind />
      </el-tab-pane>
    </el-tabs> -->
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, toRefs } from "vue";
import assetMapApi from "@/api/assetMap";
import { useRouter } from "vue-router";
import { getAssetUrl } from "@/config/index";
import IntelFind from "./components/IntelFind/index.vue";
import ExploreFind from "./components/ExploreFind/index.vue";
import './index.scss';
import { ElMessage } from "element-plus";

export default {
  name: "AssetMap",
  components: { IntelFind, ExploreFind },
  setup() {
    const state = reactive({
      tabName: "intelFind",
    });
    const router = useRouter();
    const funMethods = {
      changeTabFun() {},
    };
    const requestMethods = {
      async authUser() {
        // 跳转资产测绘之前先验证用户是否有权限
        const params2 = sessionStorage.getItem("token");
        const params3 = sessionStorage.getItem("sid");
        const params4 = sessionStorage.getItem("uid");
        if(sessionStorage.getItem('uname')!='admin'){
          ElMessage.error('用户无权限')
          return router.push("home");
        }
        const res = await assetMapApi.authUserSafe({ id: params4 });
        if (res.code == 200) {
          return window.open(
            `http://${res.cosUrl}/ticket/login?username=${params3}&sso_ticket=${params2}`,
            "_self"
          );
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
.asset-map {
  height: calc(100vh - 100px);
  width: calc(100% - 40px);
  background-image: url("../../assets/bigScreen/menu/backImg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  color: #fff;
  padding-left: 20px;
  padding-right: 20px;
}
</style>

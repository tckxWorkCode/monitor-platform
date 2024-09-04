// 1 引入所需方法
// 路由创建：createRouter
// 路由模式(两者任选其一)：createWebHistory - history模式、createWebHashHistory - hash模式
// RouteRecordRaw：意为路由原始信息 （使用vue3+js的不用引入）
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { getUrlParams, isNull } from "../utils";
import { currentUserMenu, isLogin, userAuthSet } from "@/utils/security";
import { ElMessage } from "element-plus";

export const reidrect = (href: string) => {
  let prefix = process.env.VUE_APP_PBPATH;
  if (isNull(prefix) || prefix === "/") {
    prefix = "";
  }
  window.location.href = `${prefix}${href}`;
};

// 设置路由规则
const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "登录页",
    component: () => import("@/pages/Login/index.vue"),
  },
  {
    path: "/admin",
    name: "大屏",
    component: () => import("@/layout/index.vue"),
    children: [
      {
        path: "/home",
        name: "首页",
        component: () => import("@/pages/home/index.vue"),
      },
      {
        path: "/detectWarn",
        name: "检测预警",
        component: () => import("@/pages/DetectWarn/index.vue"),
      },
      {
        path: "/attackRecall",
        name: "攻击回溯",
        component: () => import("@/pages/AttackBacktrack/index.vue"),
      },
      {
        path: "/sysMonitor",
        name: "系统监控",
        component: () => import("@/pages/SysMonitor/index.vue"),
      },
      {
        path: "/rulesMan",
        name: "规则管理",
        component: () => import("@/pages/RulesMan/index.vue"),
      },
      {
        path: "/manCenter",
        name: "管理中心",
        component: () => import("@/pages/ManCenter/index.vue"),
      },
      {
        path: "/assetMap",
        name: "资产测绘",
        component: () => import("@/pages/AssetMap/index.vue"),
      },
    ],
  },
  { path: "/#/home", redirect: "/home" },
  {
    // 输入非法路径重定向到首页
    path: "/",
    redirect: () => {
      const getId = sessionStorage.getItem("token");
      if (getId) {
        return "/home";
      } else {
        return "/login";
      }
    },
  },
];

// 设置路由
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL || ""),
  routes,
});

const goLogin = (errorMsg: string = "请先登录!") => {
  ElMessage.error(errorMsg);
  setTimeout(() => {
    reidrect("/login");
  }, 300);
};


router.beforeEach((to, from, next) => {
  if(sessionStorage.getItem("uname")){
    next();  // 继续路由导航
  } else {
    if(to.path === '/login'){
      next();  // 正在前往登录页面，不进行重定向
    } else {
      next('/login');  // 重定向至登录页面
    }
  }
});

export default router;

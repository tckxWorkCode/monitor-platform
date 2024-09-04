import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// 全局的样式
import "@/assets/common.scss";
import "@/assets/reset.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import locale from "element-plus/lib/locale/lang/zh-cn";
// iconfont 图标
import "@/assets/icon/iconfont.css";
// import DataV from '@dataview/datav-vue3';
import dataV from '@jiaminghi/data-view'
import './utils/rem';
 // import 'lib-flexible-computer';



const app = createApp(App);

// app.use(DataV, { classNamePrefix: 'dv-' });
app.use(dataV)  
app.use(router);
app.use(ElementPlus, { locale });
app.mount("#app");

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}  
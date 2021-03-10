import "element-ui/packages/theme-chalk/src/index.scss";
import ElAdminTable from "./index.vue";
// install function executed by Vue.use()
export function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component("ElAdminTable", ElAdminTable);
}

// Create module definition for Vue.use()
const Plugin = {
  install
};

// To auto-install when vue is found
let GlobalVue = null;
if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(Plugin);
}

// To allow use as module (npm/webpack/etc.) export component
export default Plugin;

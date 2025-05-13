import { createRouter, createWebHashHistory } from "vue-router";
import { components } from "vuetify/dist/vuetify.js";
import Dashboard from "@/pages/index.vue";
const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default router;

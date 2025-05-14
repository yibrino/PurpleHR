import { createRouter, createWebHashHistory } from "vue-router";
import { components } from "vuetify/dist/vuetify.js";
import Dashboard from "@/pages/index.vue";
import EmployeesPage from "@/pages/EmployeesPage.vue";
const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
    children: [
      { path: "/employees", name: "employees", component: EmployeesPage },
    ],
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default router;

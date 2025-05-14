import { createRouter, createWebHistory } from "vue-router";
import { components } from "vuetify/dist/vuetify.js";
import Dashboard from "@/pages/index.vue";
import EmployeesPage from "@/pages/EmployeesPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Dashboard",
      redirect: '/employees',
      component: Dashboard,
      children: [
        { path: "/employees", name: "employees", component: EmployeesPage },
      ],
    },
  ],
});

export default router;

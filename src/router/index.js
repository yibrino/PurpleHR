import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "@/pages/index.vue";
import EmployeesPage from "@/pages/EmployeesPage.vue";
import EmployeeProfile from "@/pages/EmployeeProfile.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Dashboard",
      redirect: "/employees",
      component: Dashboard,
      children: [
        {
          path: "employees",
          name: "employees",
          component: EmployeesPage,
        },
        {
          path: "employee/:id",
          name: "EmployeeProfile",
          component: EmployeeProfile,
          props: true,
        },
        {
          path: "employee/:id/edit",
          name: "EmployeeProfileEdit",
          component: EmployeeProfile,
          props: true,
        },
      ],
    },
  ],
});

export default router;

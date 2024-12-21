import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import ForgotPasswordView from "@/views/ForgotPasswordView.vue";

import JobsView from "@/views/JobsView.vue";
import JobDetailsView from "@/views/JobDetailsView.vue";

import AddJobView from "@/views/AddJobView.vue";
import EditJobView from "@/views/EditJobView.vue";

import NotFoundView from "@/views/NotFoundView.vue";

import DashboardView from "@/dashboard/DashboardView.vue";
import HistoryView from "@/dashboard/HistoryView.vue";

import CompanyDetailsView from "@/dashboard/CompanyDetailsView.vue";
// import axios from "axios";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/dashboard/:role",
      name: "Dashboard",
      component: DashboardView,
      meta: { requiresAuth: true },
      children: [
        {
          path: "search",
          name: "UserSearchJobs",
          component: JobsView,
        },
        {
          path: "job/:id",
          name: "UserSingleJob",
          component: JobDetailsView,
        },
        {
          path: "apply-history",
          name: "UserApplicationHistory",
          component: HistoryView,
        },
        // Fitur khusus perusahaan
        {
          path: "company-details",
          name: "CompanyDetails",
          component: CompanyDetailsView,
          meta: { requiresRole: "company" },
        },
        {
          path: "add-job",
          name: "AddJob",
          component: AddJobView,
          meta: { requiresRole: "company" },
        },
        {
          path: "edit-job/:id",
          name: "EditJob",
          component: EditJobView,
          meta: { requiresRole: "company" },
        },
      ],
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
    },
    {
      path: "/register/:role",
      name: "Register",
      component: RegisterView,
    },
    {
      path: "/forgot-password",
      name: "ForgotPassword",
      component: ForgotPasswordView,
    },
    {
      path: "/search",
      name: "SearchJobs",
      component: JobsView,
    },
    {
      path: "/job/:id",
      name: "SingleJob",
      component: JobDetailsView,
    },
    {
      path: "/jobs/add",
      name: "add-job",
      component: AddJobView,
    },
    {
      path: "/jobs/edit/:id",
      name: "edit-job",
      component: EditJobView,
    },
    {
      path: "/:catchAll(.*)",
      name: "NotFound",
      component: NotFoundView,
    },
  ],
});

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const role = localStorage.getItem("userRole");
  const token = localStorage.getItem("authToken");

  // Jika halaman membutuhkan otentikasi dan token tidak ada
  if (to.meta.requiresAuth && !token) {
    return next("/login");
  }

  // Jika mengakses halaman "/" dan pengguna sudah login, arahkan ke dashboard role mereka
  if (to.path === "/" && role) {
    return next(`/dashboard/${role}`);
  }

  // Jika mengakses halaman dashboard tanpa login, arahkan ke halaman "/"
  if (to.path.startsWith("/dashboard") && !role) {
    return next("/");
  }

  // Jika mengakses halaman dashboard dengan role yang tidak cocok
  if (to.path.startsWith("/dashboard")) {
    const expectedRole = to.params.role;

    if (role && expectedRole !== role) {
      const newPath = `/dashboard/${role}${to.path.replace(
        `/dashboard/${expectedRole}`,
        ""
      )}`;
      return next(newPath);
    }
  }

  // Cek apakah route yang diakses adalah /register/:role
  if (to.path.startsWith("/register/")) {
    // Jika role tidak cocok, tidak perlu redirect ke dashboard
    return next();
  }

  // Jika role ada dan tidak sesuai dengan URL
  if (to.params.role && to.params.role !== role) {
    return next(`/dashboard/${role}`);
  }

  // Default, lanjutkan ke halaman yang diminta
  next();
});

export default router;

<script setup>
import { ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import router from "@/router";
import logo from "@/assets/img/logo.png";

const isActiveLink = (routePath) => {
  const route = useRoute();
  return route.path === routePath;
};

const role = ref(localStorage.getItem("userRole"));

const logout = () => {
  const toast = useToast();

  localStorage.removeItem("authToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userRole");
  localStorage.removeItem("companyId");
  localStorage.removeItem("userEmail");

  role.value = null;

  toast.success("Log out Successfully");
  router.push("/");
};
</script>

<template>
  <nav class="bg-[#0e5739] border-b border-[#0f6d47]">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="flex h-20 items-center justify-between">
        <div
          class="flex flex-1 items-center justify-center md:items-stretch md:justify-start"
        >
          <!-- Logo -->
          <RouterLink to="/" class="flex flex-shrink-0 items-center mr-4">
            <img class="h-10 w-auto" :src="logo" alt="Vue Jobs" />
            <span
              class="hidden md:block text-white text-2xl font-bold ml-2 hover:text-zinc-200"
              >Jobs Vacancies</span
            >
          </RouterLink>

          <!-- Default Section -->
          <div v-if="role === null" class="md:ml-auto">
            <div class="flex space-x-2">
              <RouterLink
                to="/"
                :class="[
                  isActiveLink('/')
                    ? 'bg-[#0e6e46] hover:bg-[#06281c]'
                    : 'hover:bg-[#06281c] hover:text-white',
                  'text-white',
                  'rounded-md',
                  'px-3',
                  'py-2',
                ]"
                >Home</RouterLink
              >
              <RouterLink
                to="/search"
                :class="[
                  isActiveLink('/search')
                    ? 'bg-[#0e6e46] hover:bg-[#06281c]'
                    : 'hover:bg-[#06281c] hover:text-white',
                  'text-white',
                  'rounded-md',
                  'px-3',
                  'py-2',
                ]"
                >Search job</RouterLink
              >
              <RouterLink
                to="/login"
                :class="[
                  isActiveLink('/login')
                    ? 'bg-[#0e6e46] hover:bg-[#06281c]'
                    : 'hover:bg-[#06281c] hover:text-white',
                  'text-white',
                  'rounded-md',
                  'px-3',
                  'py-2',
                ]"
                >Sign in</RouterLink
              >
              <RouterLink
                to="/register/company"
                :class="[
                  isActiveLink('/register/company')
                    ? 'bg-[#0e6e46] hover:bg-[#06281c] border-2'
                    : 'hover:bg-[#06281c] hover:text-white border-2',
                  'text-white',
                  'rounded-md',
                  'px-3',
                  'py-2',
                ]"
                >FOR COMPANIES</RouterLink
              >
            </div>
          </div>

          <!-- User Section -->
          <div v-else-if="role === 'user'" class="md:ml-auto">
            <div class="flex space-x-2">
              <RouterLink
                to="/dashboard/user"
                :class="[
                  isActiveLink('/dashboard/user')
                    ? 'bg-[#0e6e46] hover:bg-[#06281c]'
                    : 'hover:bg-[#06281c] hover:text-white',
                  'text-white',
                  'rounded-md',
                  'px-3',
                  'py-2',
                ]"
                >Home</RouterLink
              >
              <RouterLink
                to="/dashboard/user/search"
                :class="[
                  isActiveLink('/dashboard/user/search')
                    ? 'bg-[#0e6e46] hover:bg-[#06281c]'
                    : 'hover:bg-[#06281c] hover:text-white',
                  'text-white',
                  'rounded-md',
                  'px-3',
                  'py-2',
                ]"
                >Search job</RouterLink
              >
              <RouterLink
                to="/dashboard/user/apply-history"
                :class="[
                  isActiveLink('/dashboard/user/apply-history')
                    ? 'bg-[#0e6e46] hover:bg-[#06281c]'
                    : 'hover:bg-[#06281c] hover:text-white',
                  'text-white',
                  'rounded-md',
                  'px-3',
                  'py-2',
                ]"
                >Apply History</RouterLink
              >
              <button
                type="button"
                @click="logout"
                class="hover:bg-[#06281c] border-2 text-white rounded-md px-3 py-2"
              >
                Log out
              </button>
            </div>
          </div>

          <!-- Company Section -->
          <div v-else-if="role === 'company'" class="md:ml-auto">
            <div class="flex space-x-2">
              <RouterLink
                to="/dashboard/company"
                :class="[
                  isActiveLink('/dashboard/company')
                    ? 'bg-[#0e6e46] hover:bg-[#06281c]'
                    : 'hover:bg-[#06281c] hover:text-white',
                  'text-white',
                  'rounded-md',
                  'px-3',
                  'py-2',
                ]"
                >Home</RouterLink
              >
              <RouterLink
                to="/dashboard/company/search"
                :class="[
                  isActiveLink('/dashboard/company/search')
                    ? 'bg-[#0e6e46] hover:bg-[#06281c]'
                    : 'hover:bg-[#06281c] hover:text-white',
                  'text-white',
                  'rounded-md',
                  'px-3',
                  'py-2',
                ]"
                >Job history</RouterLink
              >
              <RouterLink
                to="/dashboard/company/add-job"
                :class="[
                  isActiveLink('/dashboard/company/add-job')
                    ? 'bg-[#0e6e46] hover:bg-[#06281c]'
                    : 'hover:bg-[#06281c] hover:text-white',
                  'text-white',
                  'rounded-md',
                  'px-3',
                  'py-2',
                ]"
                >Add job</RouterLink
              >
              <RouterLink
                to="/dashboard/company/apply-history"
                :class="[
                  isActiveLink('/dashboard/company/apply-history')
                    ? 'bg-[#0e6e46] hover:bg-[#06281c]'
                    : 'hover:bg-[#06281c] hover:text-white',
                  'text-white',
                  'rounded-md',
                  'px-3',
                  'py-2',
                ]"
                >Manage applicant</RouterLink
              >
              <button
                type="button"
                @click="logout"
                class="hover:bg-[#06281c] border-2 text-white rounded-md px-3 py-2"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

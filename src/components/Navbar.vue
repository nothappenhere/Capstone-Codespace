<script setup>
import { RouterLink, useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import router from "@/router";
import logo from "@/assets/img/logo.png";

const isActiveLink = (routePath) => {
  const route = useRoute();
  return route.path === routePath;
};

const role = localStorage.getItem("userRole");
console.log(role);

const toast = useToast();
const logout = () => {
  localStorage.removeItem("authToken"); // Hapus token dari localStorage
  localStorage.removeItem("userRole"); // Hapus role user dari localStorage

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

          <!-- User Section -->
          <div v-if="role === 'user'" class="md:ml-auto">
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
                >Job search</RouterLink
              >

              <!-- <RouterLink
                to="/jobs/add"
                :class="[
                  isActiveLink('/jobs/add')
                    ? 'bg-[#06281c] hover:bg-[#0e6e46]'
                    : 'hover:bg-[#0e6e46] hover:text-white',
                  'text-white',
                  'rounded-md',
                  'px-3',
                  'py-2',
                ]"
                >Add Job</RouterLink
              > -->

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
                >History</RouterLink
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

          <!-- Home Section -->
          <div class="md:ml-auto" v-else>
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
                >Job search</RouterLink
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
        </div>
      </div>
    </div>
  </nav>
</template>

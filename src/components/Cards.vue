<script setup>
import { RouterLink, useRoute } from "vue-router";

const isActiveLink = (routePath) => {
  const route = useRoute();
  return route.path === routePath;
};
</script>

<template>
  <section class="py-8">
    <div class="container-xl lg:container m-auto">
      <!-- Home Section -->
      <div
        v-if="isActiveLink('/')"
        class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg"
      >
        <div class="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold">For Everyone</h2>
          <p class="mt-2 mb-4">
            Explore job openings and start your career today.
          </p>
          <RouterLink
            to="/search"
            class="inline-block bg-[#0e573a] text-white rounded-lg px-4 py-2 hover:bg-[#0f6d47]"
          >
            Browse Jobs
          </RouterLink>
        </div>

        <div class="bg-[#d5f6e1] p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold">For Companies</h2>
          <p class="mt-2 mb-4">
            List your job to find the right employee for the role.
          </p>
          <RouterLink
            to="/register/company"
            class="inline-block bg-[#20a96c] text-white rounded-lg px-4 py-2 hover:bg-[#138857]"
          >
            Add Jobs
          </RouterLink>
        </div>
      </div>

      <!-- User Section -->
      <div
        v-if="isActiveLink('/dashboard/user')"
        class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg"
      >
        <div class="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold">Looking for a job?</h2>
          <p class="mt-2 mb-4">
            Browse job openings and start your career today.
          </p>
          <RouterLink
            to="/dashboard/user/search"
            class="inline-block bg-[#0e573a] text-white rounded-lg px-4 py-2 hover:bg-[#0f6d47]"
          >
            Browse Jobs
          </RouterLink>
        </div>

        <div class="bg-[#d5f6e1] p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold">Application History</h2>
          <p class="mt-2 mb-4">
            See the list of applications you've made so far.
          </p>
          <RouterLink
            to="/dashboard/user/apply-history"
            class="inline-block bg-[#20a96c] text-white rounded-lg px-4 py-2 hover:bg-[#138857]"
          >
            View History
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

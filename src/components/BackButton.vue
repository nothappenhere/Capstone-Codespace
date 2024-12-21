<script setup>
import { RouterLink, useRoute } from "vue-router";

const isActiveLink = (routePath) => {
  const route = useRoute();
  return route.path === routePath;
};

defineProps({
  id: {
    type: Number,
  },
});
</script>

<template>
  <section>
    <div class="container m-auto py-6 px-8">
      <!-- Home Section -->
      <RouterLink
        v-if="isActiveLink(`/job/${id}`)"
        to="/search"
        class="text-green-500 hover:text-green-600 flex items-center"
      >
        <i class="fas fa-arrow-left mr-2"></i> Back to available jobs
      </RouterLink>

      <!-- User Section -->
      <RouterLink
        v-if="isActiveLink(`/dashboard/user/job/${id}`)"
        to="/dashboard/user/search"
        class="text-green-500 hover:text-green-600 flex items-center"
      >
        <i class="fas fa-arrow-left mr-2"></i> Back to available jobs
      </RouterLink>

      <!-- Company Section -->
      <RouterLink
        v-if="isActiveLink(`/dashboard/company/job/${id}`)"
        to="/dashboard/company/search"
        class="text-green-500 hover:text-green-600 flex items-center"
      >
        <i class="fas fa-arrow-left mr-2"></i> Back to available jobs
      </RouterLink>

      <RouterLink
        v-if="isActiveLink(`/dashboard/company/edit-job/${id}`)"
        :to="`/dashboard/company/job/${id}`"
        class="text-green-500 hover:text-green-600 flex items-center"
      >
        <i class="fas fa-arrow-left mr-2"></i> Back to job details
      </RouterLink>
    </div>
  </section>
</template>

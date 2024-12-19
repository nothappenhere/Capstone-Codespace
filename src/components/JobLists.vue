<script setup>
import { reactive, defineProps, onMounted } from "vue";
import { RouterLink, useRoute } from "vue-router";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import axios from "axios";

import JobDetails from "./JobCardLists.vue";

const isActiveLink = (routePath) => {
  const route = useRoute();
  return route.path === routePath;
};

defineProps({
  limit: {
    type: Number,
  },
});

const state = reactive({
  jobs: [],
  isLoading: true,
});

onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:8000/jobs");
    state.jobs = response.data.jobs;
  } catch (error) {
    console.error("Error fetching Jobs API", error);
  } finally {
    state.isLoading = false;
  }
});
</script>

<template>
  <section class="bg-[#eefbf4] px-4 py-10">
    <div class="container-xl lg:container m-auto">
      <h2
        v-if="isActiveLink('/') || isActiveLink('/dashboard/user')"
        class="text-3xl font-bold text-[#118a54] mb-6 text-center"
      >
        Newly Added Jobs
      </h2>

      <h2 v-else class="text-3xl font-bold text-[#118a54] mb-6 text-center">
        All Available Jobs
      </h2>

      <div v-if="state.isLoading" class="text-center py-6">
        <PulseLoader />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <JobDetails
          v-for="job in state.jobs.slice(0, limit || state.jobs.length)"
          :key="job.job_id"
          :job="job"
        />
      </div>
    </div>
  </section>

  <section class="m-auto max-w-lg my-10 px-6">
    <!-- Home Section -->
    <RouterLink
      v-if="isActiveLink('/')"
      to="/search"
      class="block bg-[#0e573a] text-white text-center py-4 px-6 rounded-xl hover:bg-[#0f6d47]"
      >View all available jobs</RouterLink
    >

    <!-- User Section -->
    <RouterLink
      v-if="isActiveLink('/dashboard/user')"
      to="/dashboard/user/search"
      class="block bg-[#0e573a] text-white text-center py-4 px-6 rounded-xl hover:bg-[#0f6d47]"
      >View all available jobs</RouterLink
    >
  </section>
</template>

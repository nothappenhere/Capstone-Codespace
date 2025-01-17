<script setup>
import { reactive, defineProps, onMounted } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import axios from "axios";

import JobCardLists from "./JobCardLists.vue";
const toast = useToast();

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
    const response = await axios.get("/api/jobs");
    state.jobs = response.data.data;
    state.isLoading = false;
  } catch (error) {
    if (error.response && error.response.data.error) {
      toast.error(error.response.data.error); // Pesan error dari server
    } else {
      console.error("Error fetching Jobs API", error);
    }
  }
});
</script>

<template>
  <section class="bg-[#eefbf4] px-4 py-10">
    <div class="container-xl lg:container m-auto">
      <!-- <h2
        v-if="state.jobs.length === 0 && isActiveLink('/dashboard/company')"
        class="text-4xl font-bold text-[#118a54] mb-6 text-center"
      >
        You haven't added any jobs
      </h2> -->

      <div
        v-if="
          state.jobs.length === 0 &&
          (isActiveLink('/dashboard/company') ||
            isActiveLink('/dashboard/company/search'))
        "
        class="flex flex-col items-center justify-center"
      >
        <h2 class="text-4xl font-bold text-[#118a54] mb-6 text-center">
          You haven't added any jobs.
        </h2>
        <RouterLink
          to="/dashboard/company/add-job"
          class="bg-green-600 hover:bg-green-700 rounded-md border px-6 py-4 text-white"
          >Add Jobs Now!</RouterLink
        >
      </div>

      <h2
        v-else-if="
          state.jobs.length > 0 && isActiveLink('/dashboard/company/search')
        "
        class="text-3xl font-bold text-[#118a54] mb-6 text-center"
      >
        All Published Jobs
      </h2>

      <h2
        v-else-if="
          state.jobs.length > 0 &&
          (isActiveLink('/') ||
            isActiveLink('/dashboard/user') ||
            isActiveLink('/dashboard/company'))
        "
        class="text-3xl font-bold text-[#118a54] mb-6 text-center"
      >
        Newly Added Jobs
      </h2>

      <h2
        v-else-if="
          state.jobs.length > 0 &&
          (isActiveLink('/search') || isActiveLink('/dashboard/user/search'))
        "
        class="text-3xl font-bold text-[#118a54] mb-6 text-center"
      >
        All Available Jobs
      </h2>

      <h2
        v-else-if="state.jobs.length === 0"
        class="text-4xl font-bold text-[#118a54] mb-6 text-center"
      >
        Sorry, there are no job vacancies at the moment.
      </h2>

      <div v-if="state.isLoading" class="text-center py-6">
        <PulseLoader />
      </div>

      <div
        v-if="state.jobs.length > 0"
        class="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <JobCardLists
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
      v-if="state.jobs.length > 0 && isActiveLink('/')"
      to="/search"
      class="block bg-[#0e573a] text-white text-center py-4 px-6 rounded-xl hover:bg-[#0f6d47]"
      >View all available jobs</RouterLink
    >

    <!-- User Section -->
    <RouterLink
      v-if="state.jobs.length > 0 && isActiveLink('/dashboard/user')"
      to="/dashboard/user/search"
      class="block bg-[#0e573a] text-white text-center py-4 px-6 rounded-xl hover:bg-[#0f6d47]"
      >View all available jobs</RouterLink
    >

    <!-- Company Section -->
    <RouterLink
      v-if="state.jobs.length > 0 && isActiveLink('/dashboard/company')"
      to="/dashboard/company/search"
      class="block bg-[#0e573a] text-white text-center py-4 px-6 rounded-xl hover:bg-[#0f6d47]"
      >View all jobs</RouterLink
    >
    <RouterLink
      v-else-if="state.jobs.length === 0 && isActiveLink('/dashboard/company')"
      to="/dashboard/company/add-job"
      class="block bg-[#0e573a] text-white text-center py-4 px-6 rounded-xl hover:bg-[#0f6d47]"
      >Add jobs Now</RouterLink
    >
  </section>
</template>

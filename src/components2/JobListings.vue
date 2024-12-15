<script setup>
import { reactive, defineProps, onMounted } from "vue";
import { RouterLink } from "vue-router";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import axios from "axios";

import JobListing from "../components/JobListing.vue";

defineProps({
  limit: {
    type: Number,
    default: 3,
  },
});

const state = reactive({
  jobs: [],
  isLoading: true,
});

onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:8000/jobs");
    state.jobs = response.data.data;
    console.log(state.jobs);
  } catch (error) {
    console.error("Error fetching Jobs API", error);
  } finally {
    state.isLoading = false;
  }
});
</script>

<template>
  <section class="bg-green-50 px-4 py-10">
    <div class="container-xl lg:container m-auto">
      <h2 class="text-3xl font-bold text-[#118a54] mb-6 text-center">
        Newly Added
      </h2>

      <div v-if="state.isLoading" class="text-center py-6">
        <PulseLoader />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <JobListing
          v-for="job in state.jobs.slice(0, limit || state.jobs.length)"
          :key="job.job_id"
          :job="job"
        />
      </div>
    </div>
  </section>

  <section class="m-auto max-w-lg my-10 px-6">
    <RouterLink
      to="/jobs"
      class="block bg-[#0e5739] text-white text-center py-4 px-6 rounded-xl hover:bg-[#0c4830]"
      >View available jobs</RouterLink
    >
  </section>
</template>

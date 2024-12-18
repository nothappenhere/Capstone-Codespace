<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <section class="py-8">
    <div class="container-xl lg:container m-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
        <div class="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold">For Everyone</h2>
          <p class="mt-2 mb-4">
            Explore job openings and start your career today.
          </p>
          <RouterLink
            to="/job-search"
            class="inline-block bg-[#0e573a] text-white rounded-lg px-4 py-2 hover:bg-[#0f6d47]"
          >
            Explore Jobs
          </RouterLink>
        </div>

        <div class="bg-[#d5f6e1] p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold">For Companies</h2>
          <p class="mt-2 mb-4">
            List your job to find the right employee for the role.
          </p>
          <RouterLink
            to="/jobs/add"
            class="inline-block bg-[#20a96c] text-white rounded-lg px-4 py-2 hover:bg-[#138857]"
          >
            Add Job
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

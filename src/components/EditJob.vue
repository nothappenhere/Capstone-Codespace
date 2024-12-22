<script setup>
import { reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import router from "@/router";
import axios from "axios";

import BackButton from "@/components/BackButton.vue";

const route = useRoute();
const jobId = parseInt(route.params.id);
const toast = useToast();

const form = reactive({
  title: "",
  type: "",
  description: "",
  location: "",
  salary: "",
});

const state = reactive({
  job: {},
  isLoading: true,
});

const handleSubmit = async () => {
  if (
    !form.title ||
    !form.type ||
    !form.description ||
    !form.location ||
    !form.salary
  ) {
    toast.error("All fields are required.");
    return;
  }

  const updatedJob = {
    title: form.title,
    type: form.type,
    description: form.description,
    location: form.location,
    salary: form.salary,
  };

  try {
    const response = await axios.put(`/api/job/update/${jobId}`, updatedJob);

    if (response.data && response.data.id) {
      toast.success("Job Updated Successfully");
      router.push(`/dashboard/company/job/${response.data.id}`);
    } else {
      toast.error("Failed to update job. Please try again.");
    }
  } catch (error) {
    if (error.response && error.response.data.message) {
      toast.error(error.response.data.message); // Pesan error dari server
    } else {
      console.error("Error updating job API", error);
      toast.error("Job Was Not Updated");
    }
  }
};

onMounted(async () => {
  try {
    const response = await axios.get(`/api/job/${jobId}`);
    state.job = response.data.job;

    form.title = state.job.title;
    form.type = state.job.type;
    form.description = state.job.description;
    form.location = state.job.location;
    form.salary = parseInt(state.job.salary);

    state.isLoading = false;
  } catch (error) {
    console.error("Error fetching job API", error);
  }
});
</script>

<template>
  <BackButton :id="jobId" />

  <section class="bg-green-50">
    <div class="container m-auto max-w-2xl py-8">
      <div
        class="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0"
      >
        <div v-if="state.isLoading" class="text-center font-bold text-2xl">
          Loading...
        </div>
        <form v-else @submit.prevent="handleSubmit">
          <h2 class="text-3xl text-center font-semibold mb-6">Edit Job</h2>

          <div class="mb-4">
            <label for="type" class="block text-gray-700 font-bold mb-2"
              >Job Type</label
            >
            <select
              v-model="form.type"
              id="type"
              name="type"
              class="border rounded w-full py-2 px-3"
              required
            >
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Remote">Remote</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div class="mb-4">
            <label for="title" class="block text-gray-700 font-bold mb-2"
              >Job Title</label
            >
            <input
              type="text"
              v-model="form.title"
              id="title"
              name="title"
              class="border rounded w-full py-2 px-3 mb-2"
              placeholder="eg. Beautiful Apartment In Miami"
              required
            />
          </div>

          <div class="mb-4">
            <label for="description" class="block text-gray-700 font-bold mb-2"
              >Description</label
            >
            <textarea
              id="description"
              v-model="form.description"
              name="description"
              class="border rounded w-full py-2 px-3"
              rows="4"
              placeholder="Add any job duties, expectations, requirements, etc"
            ></textarea>
          </div>

          <div class="mb-4">
            <label for="salary" class="block text-gray-700 font-bold mb-2"
              >Salary</label
            >
            <select
              v-model="form.salary"
              id="salary"
              name="salary"
              class="border rounded w-full py-2 px-3"
              required
            >
              <option value="3000000">Rp3 Juta</option>
              <option value="5000000">Rp5 juta</option>
              <option value="7000000">Rp7 juta</option>
              <option value="10000000">Rp10 juta</option>
              <option value="15000000">Rp15 juta</option>
            </select>
          </div>

          <div class="mb-4">
            <label for="location" class="block text-gray-700 font-bold mb-2">
              Location
            </label>
            <input
              type="text"
              v-model="form.location"
              id="location"
              name="location"
              class="border rounded w-full py-2 px-3 mb-2"
              placeholder="Job Location"
              required
            />
          </div>

          <div>
            <button
              class="bg-[#076d0d] hover:bg-[#0b5c11] text-white font-bold py-3 px-4 rounded-sm w-full focus:outline-none focus:shadow-outline mt-2"
              type="submit"
            >
              Update Job
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from "vue";
import axios from "axios";
import router from "@/router";
import { useToast } from "vue-toastification";

const userId = ref(localStorage.getItem("companyId"));

const form = reactive({
  title: "",
  type: "Full Time",
  description: "",
  location: "",
  salary: "3000000",
});

const handleSubmit = async () => {
  const toast = useToast();
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

  const newJob = {
    title: form.title,
    type: form.type,
    description: form.description,
    location: form.location,
    salary: form.salary,
    company_id: userId.value,
  };

  try {
    const response = await axios.post(`/api/add/job`, newJob);

    if (response.data && response.data.id) {
      toast.success("Job Added Successfully");
      router.push(`/dashboard/company/job/${response.data.id}`);
    } else {
      toast.error("Failed to adding job, please try again in minutes.");
    }
  } catch (error) {
    if (error.response && error.response.data.message) {
      toast.error(error.response.data.message); // Pesan error dari server
    } else {
      console.error("Error fetching Job API", error);
      toast.error("Job Was Not Added");
    }
  }
};
</script>

<template>
  <section class="bg-green-50">
    <div class="container m-auto max-w-2xl py-8">
      <div
        class="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0"
      >
        <form @submit.prevent="handleSubmit">
          <h2 class="text-3xl text-center font-semibold mb-6">Add Job</h2>

          <div class="mb-4">
            <label for="type" class="block text-gray-700 font-bold mb-2"
              >Job Type</label
            >
            <select
              id="type"
              v-model="form.type"
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
              id="title"
              type="text"
              v-model="form.title"
              class="border rounded w-full py-2 px-3 mb-2"
              placeholder="eg. Backend Developer"
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
              id="salary"
              v-model="form.salary"
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
              id="location"
              type="text"
              v-model="form.location"
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
              Add Job
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

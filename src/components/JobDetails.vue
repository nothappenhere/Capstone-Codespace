<script setup>
import { reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import axios from "axios";

import BackButton from "@/components/BackButton.vue";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(number);
};

const state = reactive({
  job: {},
  isLoading: true,
});

const jobId = parseInt(route.params.id);
const userId = localStorage.getItem("userId");
const role = localStorage.getItem("userRole");

const checkRole = async () => {
  if (role === "user") {
    try {
      await axios.post("/api/apply", {
        job_id: jobId,
        user_id: parseInt(userId),
      });

      toast.success("Successfully applied for the job.");
      router.push("/dashboard/user/apply-history");
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.info(error.response.data.message); // Pesan error dari server
      } else {
        toast.error("Error while applying job, please try again in minutes.");
      }
    }
  } else {
    toast.info("Sorry, you have to log in first to apply for that job.");
    router.push("/login");
  }
};

const deleteJob = async () => {
  try {
    const confirm = window.confirm("Are you sure you want to delete this job?");
    if (!jobId || isNaN(jobId)) {
      toast.error("Invalid Job ID");
      return;
    }

    if (confirm) {
      await axios.delete(`/api/delete/job/${jobId}`);

      toast.success("Job Deleted Successfully");
      router.push("/dashboard/company/search");
    }
  } catch (error) {
    console.error("Error deleting Job API", error);
    toast.error("Job Not Deleted");
  }
};

onMounted(async () => {
  try {
    const response = await axios.get(`/api/job/${jobId}`);
    state.job = response.data.job;

    state.isLoading = false;
  } catch (error) {
    console.error("Error fetching Job API", error);
  }
});
</script>

<template>
  <BackButton :id="jobId" />

  <section v-if="!state.isLoading" class="bg-[#eefbf4]">
    <div class="container m-auto py-8 px-6">
      <div class="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
        <main>
          <div
            class="bg-white p-6 rounded-md shadow-md text-center md:text-left"
          >
            <div class="text-gray-500">{{ state.job.type }}</div>
            <h1 class="text-3xl font-bold my-4">{{ state.job.title }}</h1>
            <div
              class="text-gray-500 flex items-center justify-center md:justify-start"
            >
              <i
                class="fa-solid fa-location-dot text-lg text-orange-700 mr-2"
              ></i>
              <p class="text-orange-700">{{ state.job.location }}</p>
            </div>
          </div>

          <div class="bg-white p-6 rounded-md shadow-md mt-6">
            <h3 class="text-green-800 text-xl font-bold">Job Description</h3>

            <p class="mt-1 mb-4">
              {{ state.job.description }}
            </p>

            <h3 class="text-green-800 text-xl font-bold">Salary</h3>

            <p class="mt-1 mb-4">{{ rupiah(state.job.salary) }}/Month</p>
          </div>
        </main>

        <!-- Sidebar -->
        <aside>
          <!-- Company Info -->
          <div class="bg-white p-6 rounded-md shadow-md">
            <h2 class="text-3xl font-bold">{{ state.job.company.name }}</h2>

            <p class="text-md my-2">{{ state.job.company.description }}</p>

            <hr class="my-4" />

            <h3 class="text-lg">Contact Email:</h3>
            <p class="my-2 bg-[#e3f5e3] px-2 py-3 font-bold">
              {{ state.job.company.email }}
            </p>

            <h3 class="text-lg">Location:</h3>
            <p class="my-2 bg-[#e3f5e3] px-2 py-3 font-bold">
              {{ state.job.company.location }}
            </p>
          </div>

          <!-- Manage -->
          <div
            v-if="role === 'user' || role != 'company'"
            class="bg-white p-6 rounded-lg shadow-md mt-6"
          >
            <h3 class="text-2xl font-bold mb-6">Interested in this job?</h3>
            <button
              type="button"
              @click="checkRole"
              class="bg-[#358436] hover:bg-[#307131] text-white text-center font-bold py-2 px-4 rounded-sm w-full focus:outline-none focus:shadow-outline mt-4 block"
            >
              Apply Now!
            </button>
          </div>

          <!-- Company Manage -->
          <div
            v-else-if="role === 'company'"
            class="bg-white p-6 rounded-lg shadow-md mt-6"
          >
            <h3 class="text-2xl font-bold mb-6">Manage Job</h3>
            <RouterLink
              :to="`/dashboard/company/edit-job/${state.job.job_id}`"
              class="bg-[#358436] hover:bg-[#307131] text-white text-center font-bold py-2 px-4 rounded-sm w-full focus:outline-none focus:shadow-outline mt-4 block"
              >Edit Job</RouterLink
            >
            <button
              @click="deleteJob"
              class="bg-[#b10303] hover:bg-[#920a0a] text-white text-center font-bold py-2 px-4 rounded-sm w-full focus:outline-none focus:shadow-outline mt-4 block"
            >
              Delete Job
            </button>
          </div>
        </aside>
      </div>
    </div>
  </section>

  <div v-else class="text-center text-gray-500 py-6">
    <PulseLoader />
  </div>
</template>

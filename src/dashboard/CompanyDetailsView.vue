<script setup>
import { onMounted, reactive } from "vue";
import axios from "axios";
import router from "@/router";
import { useToast } from "vue-toastification";
import { ref } from "vue";

const userId = ref(localStorage.getItem("userId"));
const email = ref(localStorage.getItem("userEmail"));

const form = reactive({
  name: "",
  description: "",
  email: email.value,
  location: "",
});

const toast = useToast();
const handleSubmit = async () => {
  if (!form.name || !form.description || !form.email || !form.location) {
    toast.error("All fields are required.");
    return;
  }

  const companyDetails = {
    name: form.name,
    description: form.description,
    email: form.email,
    location: form.location,
    user_id: userId.value,
  };

  try {
    const response = await axios.post(`/api/company-details`, companyDetails);

    if (response.data && response.data.id) {
      toast.success("Company Details Added Successfully");
      router.push(`/dashboard/company`);
    } else {
      toast.error(
        "Failed to adding company details, please try again in minutes."
      );
    }
  } catch (error) {
    if (error.response && error.response.data.message) {
      toast.error(error.response.data.message); // Pesan error dari server
    } else {
      console.error("Error fetching API", error);
      toast.error("Company details Was Not Added");
    }
  }
};

onMounted(async () => {
  try {
    const response = await axios.get(`/api/company-status/${userId.value}`);

    if (response.data && response.data.isComplete) {
      router.push(`/dashboard/company`);
    } else {
      toast.info(
        "You have to fill in the company details first before using the app."
      );
    }
  } catch (error) {
    if (error.response && error.response.data.message) {
      toast.error(error.response.data.message); // Pesan error dari server
    } else {
      console.error("Error fetching API", error);
    }
  }
});
</script>

<template>
  <section class="bg-green-50">
    <div class="container m-auto max-w-2xl py-8">
      <div
        class="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0"
      >
        <form @submit.prevent="handleSubmit">
          <h2 class="text-3xl text-center font-semibold mb-6">
            Add Company Details
          </h2>

          <div class="mb-4">
            <label for="name" class="block text-gray-700 font-bold mb-2"
              >Company Name</label
            >
            <input
              id="name"
              type="text"
              v-model="form.name"
              class="border rounded w-full py-2 px-3 mb-2"
              placeholder="Enter Company Name"
              required
            />
          </div>

          <div class="mb-4">
            <label for="description" class="block text-gray-700 font-bold mb-2">
              Description</label
            >
            <textarea
              id="description"
              v-model="form.description"
              class="border rounded w-full py-2 px-3"
              rows="4"
              placeholder="Add any company description"
            ></textarea>
          </div>

          <div class="mb-4">
            <label for="email" class="block text-gray-700 font-bold mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              v-model="form.email"
              class="border rounded w-full py-2 px-3 mb-2"
              placeholder="eg. example@mail.com"
              required
            />
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
              placeholder="Enter Company Location"
              required
            />
          </div>

          <div>
            <button
              class="bg-[#076d0d] hover:bg-[#0b5c11] text-white font-bold py-3 px-4 rounded-sm w-full focus:outline-none focus:shadow-outline mt-2"
              type="submit"
            >
              Add Details
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

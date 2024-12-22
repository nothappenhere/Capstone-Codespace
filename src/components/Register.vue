<script setup>
import { reactive } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import router from "@/router";
import axios from "axios";
import logo from "@/assets/img/logo.png";

const isActiveLink = (routePath) => {
  const route = useRoute();
  return route.path === routePath;
};

const register = reactive({
  full_name: "",
  email: "",
  password: "",
  role: isActiveLink("/register/user") ? "user" : "company",
});

const handleSubmit = async () => {
  const toast = useToast();

  if (register.full_name === "") {
    return toast.error("Full name cannot be empty");
  } else if (register.full_name.length < 3) {
    return toast.error("Full name must be at least 3 characters");
  }
  if (!register.email.includes("@")) {
    return toast.error("Invalid email format, must be include '@' sign.");
  }
  if (register.password.length < 8) {
    return toast.error("Password must be at least 8 characters long.");
  }

  const newRegister = {
    full_name: register.full_name,
    email: register.email,
    password: register.password,
    role: register.role,
  };

  try {
    await axios.post(`/api/register/${register.role}`, newRegister);

    toast.success("Registration Successfully");
    router.push("/login");
  } catch (error) {
    if (error.response && error.response.data.error) {
      toast.error(error.response.data.error); // Pesan error dari server
    } else {
      toast.error("Something went wrong, please try again.");
    }
  } finally {
    // Hapus kredensial setelah login
    register.full_name = "";
    register.email = "";
    register.password = "";
  }
};
</script>

<template>
  <!-- User Registration -->
  <section class="bg-[#F6F6F9]" v-if="isActiveLink('/register/user')">
    <div class="container m-auto max-w-lg py-14">
      <div class="bg-white px-6 py-8 mb-4 rounded-xl m-4 md:m-0">
        <form @submit.prevent="handleSubmit">
          <img class="h-20 w-auto m-auto mb-4" :src="logo" alt="Vue Jobs" />
          <h2 class="text-3xl text-center font-semibold mb-10">
            Get Started Free
          </h2>

          <div class="mb-4 hidden">
            <input
              type="text"
              v-model="register.role"
              class="border rounded w-full py-2 px-3 mb-2"
              required
            />
          </div>

          <div class="mb-4">
            <i class="fa-solid fa-user me-2"></i>
            <label class="text-gray-700 font-bold mb-2">Full Name</label>
            <input
              type="text"
              v-model="register.full_name"
              class="border rounded w-full py-2 px-3 mb-2"
              placeholder="Enter Full Name"
              required
            />
          </div>

          <div class="mb-4">
            <i class="fa-solid fa-envelope me-2"></i>
            <label class="text-gray-700 font-bold mb-2">Email Address</label>
            <input
              type="email"
              v-model="register.email"
              pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
              class="border rounded w-full py-2 px-3 mb-2"
              placeholder="eg. example@mail.com"
              required
            />
          </div>

          <div class="mb-6">
            <i class="fa-solid fa-lock me-2"></i>
            <label class="text-gray-700 font-bold mb-2">Password</label>
            <input
              type="password"
              v-model="register.password"
              class="border rounded w-full py-2 px-3 mb-2"
              placeholder="Enter Password"
              required
            />
          </div>

          <button
            class="bg-green-600 hover:bg-green-700 rounded-sm text-white font-bold py-4 px-4 w-full"
            type="submit"
          >
            Sign Up
          </button>

          <div class="flex justify-center mt-5">
            <p class="text-gray-500 hover:text-gray-600">
              Already have an account?
              <RouterLink
                to="/login"
                class="text-[#138857] hover:text-[#0e573a]"
                >Sign In!</RouterLink
              >
            </p>
          </div>
        </form>
      </div>
    </div>
  </section>

  <!-- Company Registration -->
  <section class="bg-[#F6F6F9]" v-if="isActiveLink('/register/company')">
    <div class="container m-auto max-w-lg py-14">
      <div class="bg-white px-6 py-8 mb-4 rounded-xl m-4 md:m-0">
        <form @submit.prevent="handleSubmit">
          <img class="h-20 w-auto m-auto mb-4" :src="logo" alt="Vue Jobs" />
          <h2 class="text-3xl text-center font-semibold mb-10">
            Hire the right people for your business
          </h2>

          <div class="mb-4 hidden">
            <input
              type="text"
              v-model="register.role"
              class="border rounded w-full py-2 px-3 mb-2"
              required
            />
          </div>

          <div class="mb-4">
            <i class="fa-solid fa-user me-2"></i>
            <label class="text-gray-700 font-bold mb-2">Company Name</label>
            <input
              type="text"
              v-model="register.full_name"
              class="border rounded w-full py-2 px-3 mb-2"
              placeholder="Enter Company Name"
              required
            />
          </div>

          <div class="mb-4">
            <i class="fa-solid fa-envelope me-2"></i>
            <label class="text-gray-700 font-bold mb-2">Email Address</label>
            <input
              type="email"
              v-model="register.email"
              pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
              class="border rounded w-full py-2 px-3 mb-2"
              placeholder="eg. example@domain.com"
              required
            />
          </div>

          <div class="mb-6">
            <i class="fa-solid fa-lock me-2"></i>
            <label class="text-gray-700 font-bold mb-2">Password</label>
            <input
              type="password"
              v-model="register.password"
              class="border rounded w-full py-2 px-3 mb-2"
              placeholder="Enter Password"
              required
            />
          </div>

          <button
            class="bg-green-600 hover:bg-green-700 rounded-sm text-white font-bold py-4 px-4 w-full"
            type="submit"
          >
            Register
          </button>

          <div class="flex justify-center mt-5">
            <p class="text-gray-500 hover:text-gray-600">
              Already have an account?
              <RouterLink
                to="/login"
                class="text-[#138857] hover:text-[#0e573a]"
                >Sign In!</RouterLink
              >
            </p>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

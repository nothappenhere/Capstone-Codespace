<script setup>
import { reactive } from "vue";
import { useToast } from "vue-toastification";
import router from "@/router";
import axios from "axios";
import logo from "@/assets/img/logo.png";

const register = reactive({
  username: "",
  email: "",
  password: "",
});

const handleSubmit = async () => {
  const toast = useToast();
  if (register.username.length < 6) {
    return toast.error("Username must be at least 6 characters");
  }
  if (!register.email.includes("@")) {
    return toast.error("Invalid email format");
  }
  if (register.password.length < 8) {
    return toast.error("Password must be at least 8 characters");
  }

  const newRegister = {
    username: register.username,
    email: register.email,
    password: register.password,
  };

  try {
    await axios.post("http://localhost:8000/register", newRegister);
    // const token = response.data.token; // Ambil token dari respons server
    // localStorage.Item("authToken", token); // Simpan token di localStorage
    toast.success("Registration Successfully");
    router.push(`/login`); // Arahkan ke halaman login
  } catch (error) {
    if (error.response && error.response.data.error) {
      toast.error(error.response.data.error); // Pesan error dari server
    } else {
      toast.error("Something went wrong. Please try again!");
    }
  } finally {
    // Hapus kredensial setelah login
    register.username = "";
    register.email = "";
    register.password = "";
  }
};
</script>

<template>
  <section class="bg-[#F6F6F9]">
    <div class="container m-auto max-w-lg py-20">
      <div class="bg-white px-6 py-8 mb-4 rounded-xl m-4 md:m-0">
        <form @submit.prevent="handleSubmit">
          <img class="h-20 w-auto m-auto mb-8" :src="logo" alt="Vue Jobs" />
          <h2 class="text-3xl text-center font-semibold mb-10">
            Get Started Free
          </h2>

          <div class="mb-4">
            <i class="fa-solid fa-user me-2"></i>
            <label class="text-gray-700 font-bold mb-2">Username</label>
            <input
              type="text"
              v-model="register.username"
              class="border rounded w-full py-2 px-3 mb-2"
              placeholder="Enter Username"
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
              placeholder="eg. mail@example.com"
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
              placeholder="Enter password"
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
              <a href="/login" class="text-[#138857] hover:text-[#0e573a]"
                >Sign In!</a
              >
            </p>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

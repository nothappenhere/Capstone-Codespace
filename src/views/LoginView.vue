<script setup>
import { reactive } from "vue";
import { useToast } from "vue-toastification";
import router from "@/router";
import axios from "axios";
import logo from "@/assets/img/logo.png";

const login = reactive({
  email: "",
  password: "",
});

const handleSubmit = async () => {
  const toast = useToast();
  if (!login.email.includes("@")) {
    return toast.error("Invalid email format");
  }
  if (login.password.length < 6) {
    return toast.error("Password must be at least 6 characters");
  }

  const newLogin = {
    email: login.email,
    password: login.password,
  };

  try {
    const response = await axios.post("http://localhost:8000/login", newLogin);
    const token = response.data.token; // Ambil token dari respons server
    localStorage.setItem("authToken", token); // Simpan token di localStorage
    toast.success("Sign in Successfully");
    router.push(`/`); // Arahkan ke halaman utama
  } catch (error) {
    if (error.response && error.response.data.message) {
      toast.error(error.response.data.message); // Pesan error dari server
    } else {
      toast.error("Invalid credentials!");
    }
  } finally {
    login.email = "";
    login.password = ""; // Hapus kredensial setelah login
  }
};
</script>

<template>
  <section class="bg-[#F6F6F9]">
    <div class="container m-auto max-w-lg py-20">
      <div class="bg-white px-6 py-8 mb-4 rounded-xl m-4 md:m-0">
        <form @submit.prevent="handleSubmit">
          <img class="h-20 w-auto m-auto mb-8" :src="logo" alt="Vue Jobs" />
          <h2 class="text-3xl text-center font-semibold mb-10">Sign in</h2>

          <div class="mb-4">
            <label class="text-gray-700 font-bold mb-2">Email Address</label>
            <input
              type="email"
              v-model="login.email"
              class="border rounded w-full py-2 px-3 mb-2"
              placeholder="eg. mail@example.com"
              required
            />
          </div>

          <div class="mb-6">
            <label class="text-gray-700 font-bold mb-2">Password</label>
            <input
              type="password"
              v-model="login.password"
              class="border rounded w-full py-2 px-3 mb-2"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            class="bg-green-600 hover:bg-green-700 rounded-sm text-white font-bold py-4 px-4 w-full"
            type="submit"
          >
            Sign In
          </button>

          <div class="flex justify-between mt-5">
            <a href="/forgot-password" class="text-gray-500 hover:text-gray-600"
              >Forgot Password?</a
            >
            <a href="/register" class="text-gray-500 hover:text-gray-600"
              >Create Free Account</a
            >
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

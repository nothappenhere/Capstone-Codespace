<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <section class="text-center flex flex-col justify-center items-center my-36">
    <i class="fas fa-exclamation-triangle text-[#2f6026] fa-4x mb-4"></i>
    <h1 class="text-6xl font-bold mb-4">404 Not Found</h1>
    <p class="text-xl mb-5">This page does not exist</p>
    <RouterLink
      to="/"
      class="text-white bg-[#358436] hover:bg-[#307131] rounded-md px-3 py-2 mt-4"
      >Go Back</RouterLink
    >
  </section>
</template>

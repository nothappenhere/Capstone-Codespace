<script setup>
import { defineProps } from "vue";

defineProps({
  title: {
    type: String,
    default: "Become part of JobVacancies",
  },
  subtitle: {
    type: String,
    default: "Find the job that fits your skills and needs",
  },
});
</script>

<template>
  <section class="bg-[#0e6e46] py-20 mb-4">
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center"
    >
      <div class="text-center">
        <h1 class="text-2xl font-extrabold text-white sm:text-3xl md:text-5xl">
          Find the right company for you
        </h1>
        <p class="my-4 text-xl text-white">
          Explore company profiles to find the right workplace for you. Learn
          about jobs, reviews, company culture, perks and benefits.
        </p>
      </div>
    </div>
  </section>
</template>

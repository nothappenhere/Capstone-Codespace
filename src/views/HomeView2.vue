<script setup>
import Hero from "@/components/Hero.vue";
import HomeCards from "@/components/HomeCards2.vue";
import JobListings from "@/components/JobListings2.vue";
</script>

<template>
  <Hero />
  <HomeCards />
  <JobListings :limit="3" :showButton="true" />
</template>

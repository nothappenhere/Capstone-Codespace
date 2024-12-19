<script setup>
import Hero from "@/components/Hero.vue";
import Cards from "@/components/Cards.vue";
import JobLists from "@/components/JobLists.vue";
</script>

<template>
  <Hero />
  <Cards />
  <JobLists :limit="3" />
</template>

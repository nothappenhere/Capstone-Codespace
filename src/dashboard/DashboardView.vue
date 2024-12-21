<script setup>
import { useRoute } from "vue-router";
import Hero from "@/components/Hero.vue";
import Cards from "@/components/Cards.vue";
import JobLists from "@/components/JobLists.vue";

const route = useRoute();
</script>

<template>
  <Hero v-if="route.path === '/dashboard/user'" />
  <Cards v-if="route.path === '/dashboard/user'" />
  <JobLists :limit="3" v-if="route.path === '/dashboard/user'" />

  <Hero v-if="route.path === '/dashboard/company'" />
  <Cards v-if="route.path === '/dashboard/company'" />
  <JobLists :limit="3" v-if="route.path === '/dashboard/company'" />

  <router-view />
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import { onMounted } from "vue";
import { RouterView } from "vue-router";
</script>

<template>
  <Navbar />
  <RouterView />
</template>

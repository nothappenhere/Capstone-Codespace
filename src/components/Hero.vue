<script setup>
const role = localStorage.getItem("userRole");

const header =
  role === "user"
    ? "Find your next company"
    : role === "company"
    ? "Find your next employee"
    : role === "admin"
    ? "Organize all job applications"
    : "Become a part of JobVacancies";

const subHeader =
  role === "user"
    ? "Explore company profiles to find the right workplace for you. Learn about jobs, reviews, company culture, perks and benefits."
    : role === "company"
    ? "Post your jobs and discover the best candidates to join your team. Manage applications and streamline your hiring process."
    : role === "admin"
    ? "Manage job listings, oversee user activities, and ensure everything runs smoothly on the platform."
    : "Join us today and explore new opportunities for your career or business.";
</script>

<template>
  <section class="bg-[#0e6e46] py-20">
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center"
    >
      <div class="text-center">
        <h1
          class="text-2xl font-extrabold text-white sm:text-3xl md:text-5xl font-sans"
        >
          {{ header }}
        </h1>
        <p class="my-4 text-xl text-white">
          {{ subHeader }}
        </p>
      </div>
    </div>
  </section>
</template>

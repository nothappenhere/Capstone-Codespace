<script setup>
import { RouterLink } from "vue-router";
import { defineProps, reactive, computed } from "vue";

const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(number);
};

const props = defineProps({
  job: {
    type: Object,
  },
});

let showFullDescription = reactive(false);

const toggleFullDescription = () => {
  showFullDescription = !showFullDescription;
};

const truncatedDescription = computed(() => {
  let description = props.job.description;
  if (!showFullDescription) {
    description = description.substring(0, 90) + "...";
  }
  return description;
});
</script>

<template>
  <div class="bg-white rounded-lg shadow-md relative">
    <div class="p-4">
      <div class="mb-6">
        <div class="text-gray-600 my-2">{{ job.type }}</div>
        <h3 class="text-xl font-bold underline">{{ job.title }}</h3>
      </div>

      <div class="mb-5">
        <div>
          {{ truncatedDescription }}
        </div>
        <button
          @click="toggleFullDescription"
          class="text-[#20a96c] hover:text-[#43c486] mb-5"
        >
          {{ showFullDescription ? "Less" : "More" }}
        </button>
      </div>

      <h3 class="text-[#138857] mb-2">{{ rupiah(job.salary) }}/Month</h3>

      <div class="border border-gray-100 mb-5"></div>

      <div class="flex flex-col lg:flex-row justify-between mb-2">
        <div class="text-orange-700 mb-3">
          <i class="fa-solid fa-location-dot text-lg"></i>
          {{ job.location }}
        </div>
        <RouterLink
          :to="'/job/' + job.job_id"
          class="h-[36px] bg-[#20a96c] hover:bg-[#138857] text-white px-4 py-2 rounded-md text-center text-sm"
        >
          Read More
        </RouterLink>
      </div>
    </div>
  </div>
</template>

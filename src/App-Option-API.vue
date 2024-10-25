<script>
export default {
  data() {
    return {
      name: "Rizky Akbar",
      status: "pending",
      tasks: ["task one", "task two", "task three"],
      link: "https://google.com/",
    };
  },
  methods: {
    toggleStatus() {
      if (this.status === "active") {
        this.status = "pending";
      } else if (this.status === "pending") {
        this.status = "inactive";
      } else {
        this.status = "active";
      }
    },
  },
};
</script>

<template>
  <h1>{{ name }}</h1>
  <p v-if="status === 'active'">My account is active</p>
  <p v-else-if="status === 'pending'">My account is pending</p>
  <p v-else>My account is inactive</p>

  <h3>Task:</h3>
  <ul>
    <li v-for="task in tasks" v-bind:key="task">{{ task }}</li>
  </ul>

  <a :href="link">Click to google</a>

  <br />
  <button @click="toggleStatus">Change status</button>
</template>

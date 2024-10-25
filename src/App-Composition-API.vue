<script setup>
import { ref, onMounted } from "vue";

const name = ref("Rizky Akbar");
const status = ref("active");
const tasks = ref(["task one", "task two", "task three"]);
const newTask = ref("");

const toggleStatus = () => {
  if (status.value === "active") {
    status.value = "pending";
  } else if (status.value === "pending") {
    status.value = "inactive";
  } else {
    status.value = "active";
  }
};

const addTask = () => {
  if (newTask.value.trim() !== "") {
    tasks.value.push(newTask.value);
    newTask.value = "";
  }
};

const deleteTask = (index) => {
  tasks.value.splice(index, 1);
};

onMounted(async () => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data = await response.json();
    tasks.value = data.map((task) => {
      return task.title;
    });
  } catch (error) {
    console.log("Errof fetching data from API.", error);
  }
});
</script>

<template>
  <h1>{{ name }}</h1>
  <p v-if="status === 'active'">My account is active</p>
  <p v-else-if="status === 'pending'">My account is pending</p>
  <p v-else>My account is inactive</p>

  <form @submit.prevent="addTask">
    <label for="newTask">Add Task</label>
    <input type="text" id="newTask" name="newTask" v-model="newTask" />
    <button type="submit">Submit</button>
  </form>

  <h3>Task:</h3>
  <ul>
    <li v-for="(task, index) in tasks" v-bind:key="task">
      <span>
        {{ task }}
      </span>

      <button @click="deleteTask(index)">X</button>
    </li>
  </ul>

  <!-- <a :href="link">Click to google</a> -->

  <br />
  <button @click="toggleStatus">Change status</button>
</template>

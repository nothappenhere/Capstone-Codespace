import "@/assets/main.css";
import router from "@/router";

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import axios from "axios";

import { createApp } from "vue";
import App from "@/App.vue";

const app = createApp(App);

// Set Authorization header untuk setiap request axios
axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(
  "authToken"
)}`;

app.use(router);
app.use(Toast);
app.mount("#app");

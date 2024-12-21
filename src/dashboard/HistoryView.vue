<script setup>
import { onMounted, reactive } from "vue";
import { useToast } from "vue-toastification";
import axios from "axios";

const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(number);
};

const userId = localStorage.getItem("userId");
const companyId = localStorage.getItem("companyId");
const role = localStorage.getItem("userRole");

const state = reactive({
  history: [],
  status: "",
  isHidden: true,
  selectedHistory: null, // Item yang akan diperbarui
});

const modalShow = (history = null) => {
  state.isHidden = !state.isHidden;
  state.selectedHistory = history;
  state.status = history ? history.status : "";
};

const handleSubmit = async () => {
  const toast = useToast();

  if (!state.selectedHistory) return;

  try {
    const response = await axios.put("/api/update/job/status", {
      id: state.selectedHistory.job_id, // ID pekerjaan
      status: state.status, // Status baru
    });

    // Perbarui status di frontend
    state.selectedHistory.status = state.status;
    state.isHidden = true; // Tutup modal
    toast.success("Job Status Updated Successfully.");
  } catch (error) {
    if (error.response && error.response.data.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Job Status was not updated.");
    }
  }
};

onMounted(async () => {
  try {
    const id = role === "user" ? userId : companyId;
    const response = await axios.get(`/api/apply/history/${id}?role=${role}`);

    state.history = response.data.apply_history;
  } catch (error) {
    console.error("Error fetching application history API", error);
  }
});
</script>

<template>
  <div class="my-10 shadow-md sm:rounded-lg container-xl lg:container m-auto">
    <table
      v-if="role === 'user'"
      class="w-full text-sm text-left text-gray-500"
    >
      <caption
        class="p-5 text-lg font-semibold text-left text-gray-900 bg-white"
      >
        Application History
        <p class="mt-1 text-sm font-normal text-gray-500">
          Browse your job application history, including company details and job
          information.
        </p>
      </caption>
      <thead class="text-md text-gray-700 uppercase bg-gray-50">
        <tr class="bg-gray-200">
          <th scope="col" class="px-6 py-4">No</th>
          <th scope="col" class="px-6 py-4">Job Title</th>
          <th scope="col" class="px-6 py-4">Type</th>
          <th scope="col" class="px-6 py-4">Salary</th>
          <th scope="col" class="px-6 py-4">Location</th>
          <th scope="col" class="px-6 py-4">Company Name</th>
          <th scope="col" class="px-6 py-4">Contact Info</th>
          <th scope="col" class="px-6 py-4">Application Date</th>
          <th scope="col" class="px-6 py-4">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(history, index) in state.history"
          :key="index"
          class="bg-white border-b"
        >
          <td class="px-6 py-4">{{ (index += 1) }}</td>
          <td class="px-6 py-4">{{ history.job_title }}</td>
          <td class="px-6 py-4">{{ history.job_type }}</td>
          <td class="px-6 py-4">{{ rupiah(history.job_salary) }}</td>
          <td class="px-6 py-4">{{ history.job_location }}</td>
          <td class="px-6 py-4">{{ history.company_name }}</td>
          <td class="px-6 py-4">{{ history.company_email }}</td>
          <td class="px-6 py-4">
            {{ new Date(history.application_date).toLocaleDateString() }}
          </td>
          <td
            :class="[
              history.status === 'Rejected'
                ? 'text-red-500'
                : history.status === 'Accepted'
                ? 'text-green-500'
                : history.status === 'Reviewed'
                ? 'text-blue-500'
                : 'text-yellow-500',
              'px-6',
              'py-4',
            ]"
          >
            {{ history.status.toUpperCase() }}
          </td>
        </tr>
      </tbody>
    </table>

    <table
      v-if="role === 'company'"
      class="w-full text-sm text-left text-gray-500"
    >
      <caption
        class="p-5 text-lg font-semibold text-left text-gray-900 bg-white"
      >
        Application History
        <p class="mt-1 text-sm font-normal text-gray-500">
          Browse your job application history, including company details and job
          information.
        </p>
      </caption>
      <thead class="text-md text-gray-700 uppercase bg-gray-50">
        <tr class="bg-gray-200">
          <th scope="col" class="px-6 py-4">No</th>
          <th scope="col" class="px-6 py-4">Job Title</th>
          <th scope="col" class="px-6 py-4">Type</th>
          <th scope="col" class="px-6 py-4">Salary</th>
          <th scope="col" class="px-6 py-4">Location</th>
          <th scope="col" class="px-6 py-4">Applicant Name</th>
          <th scope="col" class="px-6 py-4">Email</th>
          <th scope="col" class="px-6 py-4">Application Date</th>
          <th scope="col" class="px-6 py-4">Status</th>
          <th scope="col" class="px-6 py-4">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(history, index) in state.history"
          :key="index"
          class="bg-white border-b"
        >
          <td class="px-6 py-4">{{ (index += 1) }}</td>
          <td class="px-6 py-4">{{ history.job_title }}</td>
          <td class="px-6 py-4">{{ history.job_type }}</td>
          <td class="px-6 py-4">{{ rupiah(history.job_salary) }}</td>
          <td class="px-6 py-4">{{ history.job_location }}</td>
          <td class="px-6 py-4">{{ history.applicant_name }}</td>
          <td class="px-6 py-4">{{ history.applicant_email }}</td>
          <td class="px-6 py-4">
            {{ new Date(history.application_date).toLocaleDateString() }}
          </td>
          <td
            :class="[
              history.status === 'Rejected'
                ? 'text-red-500'
                : history.status === 'Accepted'
                ? 'text-green-500'
                : history.status === 'Reviewed'
                ? 'text-blue-500'
                : 'text-yellow-500',
              'px-6',
              'py-4',
            ]"
          >
            {{ history.status.toUpperCase() }}
          </td>
          <td class="px-6 py-4">
            <!-- Modal toggle -->
            <a
              href="#"
              type="button"
              @click="modalShow(history)"
              class="font-medium text-blue-600 text-center hover:underline"
            >
              Edit Status
            </a>
          </td>
        </tr>
      </tbody>
    </table>

    <div
      :class="[
        state.isHidden ? 'hidden' : '',
        'fixed',
        'top-28',
        'left-96',
        'right-0',
        'z-50',
        'items-center ',
        'justify-center',
        'w-full',
        'p-4',
        ' max-h-full',
      ]"
    >
      <div class="relative w-full max-w-2xl max-h-full">
        <!-- Modal content -->
        <form
          @submit.prevent="handleSubmit"
          class="relative bg-white rounded-lg shadow"
        >
          <!-- Modal header -->
          <div class="flex items-start justify-between p-4 border-b rounded-t">
            <h3 class="text-xl font-semibold text-gray-900">
              Change application status
            </h3>
            <button
              @click="modalShow()"
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            >
              <svg
                class="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <!-- Modal body -->
          <div class="p-6 space-y-6">
            <div class="grid grid-cols-1">
              <div>
                <label
                  for="salary"
                  class="block mb-2 text-sm font-medium text-gray-900"
                  >Status</label
                >
                <select
                  id="status"
                  v-model="state.status"
                  class="border rounded w-full py-2 px-3"
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
          <!-- Modal footer -->
          <div
            class="flex items-center p-6 space-x-3 border-t border-gray-200 rounded-b"
          >
            <button
              type="submit"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

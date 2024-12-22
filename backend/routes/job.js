import express from "express";
const router = express.Router();

import {
  getAllJobs,
  getSingleJob,
  applyJob,
  getApplicationHistory,
  addJob,
  updateJob,
  deleteJob,
  updateJobStatus,
} from "../controllers/jobController.js";
import {
  authenticateUser,
  authorizeRole,
} from "../middlewares/autenticateUserAndRole.js";

//* GET all jobs with pagination and filtering
// Route untuk mendapatkan semua pekerjaan (jobs) dengan paginasi dan filter
router.get("/jobs", getAllJobs);

//* GET a single job by ID
// Route untuk mendapatkan pekerjaan berdasarkan ID
router.get("/job/:id", getSingleJob);

//* POST user applying for a job
// Route untuk melakukan pelamaran pekerjaan
router.post("/apply", applyJob);

//* GET a user's application history
// Route untuk mendapatkan riwayat lamaran pekerjaan pengguna
router.get("/job/apply-history/:id", getApplicationHistory);

//* POST add a new job
// Route untuk perusahaan dapat menambahkan pekerjaan baru
router.post("/job/add", [authenticateUser, authorizeRole(["company"])], addJob);

//* PUT update job by ID
// Route untuk perusahaan memperbarui pekerjaan berdasarkan ID
router.put(
  "/job/update/:id",
  [authenticateUser, authorizeRole(["company"])],
  updateJob
);

//* DELETE job by ID
// Route untuk perusahaan dapat menghapus pekerjaan berdasarkan ID
router.delete(
  "/job/delete/:id",
  [authenticateUser, authorizeRole(["company"])],
  deleteJob
);

//* PUT update job status
// Route untuk perusahaan memperbarui status pekerjaan pelamar
router.put(
  "/job/update-status",
  [authenticateUser, authorizeRole(["company"])],
  updateJobStatus
);

export default router;

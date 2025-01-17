import express from "express";
const router = express.Router();

import {
  getAllJobs,
  getSingleJob,
  applyJob,
  getApplicationHistory,
  addingJob,
  updateJob,
  deleteJob,
  updateJobStatus,
} from "../controllers/jobController.js";
import {
  authenticateUser,
  authorizeRole,
} from "../middlewares/autenticateUserAndRole.js";

//* GET all jobs with pagination and filtering
// Route untuk mendapatkan semua pekerjaan (jobs)
router.get("/jobs", getAllJobs);

//* GET a single job by ID
// Route untuk mendapatkan pekerjaan
router.get("/jobs/:id", getSingleJob);

//* POST user applying for a job
// Route untuk user melakukan pelamaran pekerjaan
router.post("/jobs/apply", applyJob);

//* GET a user's application history
// Route untuk user mendapatkan riwayat lamaran pekerjaan
router.get("/jobs/apply/:id", getApplicationHistory);

//* POST add a new job
// Route untuk perusahaan dapat menambahkan pekerjaan baru
router.post(
  "/jobs/add",
  [authenticateUser, authorizeRole(["company"])],
  addingJob
);

//* PUT update job by ID
// Route untuk perusahaan memperbarui data pekerjaan
router.put(
  "/jobs/update/:id",
  [authenticateUser, authorizeRole(["company"])],
  updateJob
);

//* DELETE job by ID
// Route untuk perusahaan dapat menghapus pekerjaan berdasarkan ID
router.delete(
  "/jobs/delete/:id",
  [authenticateUser, authorizeRole(["company"])],
  deleteJob
);

//* PUT update job status
// Route untuk perusahaan memperbarui status pekerjaan pelamar
router.put(
  "/jobs/update/status",
  [authenticateUser, authorizeRole(["company"])],
  updateJobStatus
);

export default router;

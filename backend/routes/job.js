import express from "express";
const router = express.Router();

import {
  getAllJobs,
  getSingleJob,
  ApplyJob,
  getApplicationHistory,
  addJob,
  updateJob,
  deleteJob,
  updateJobStatus,
} from "../controllers/jobController.js";

//* GET all jobs with pagination and filtering
router.get("/jobs", getAllJobs);

//* GET a single job by ID
router.get("/job/:id", getSingleJob);

//* POST user applying job
router.post("/apply", ApplyJob);

//* GET a user application history
router.get("/apply/history/:id", getApplicationHistory);
//* PUT update job status
router.put("/update/job/status", updateJobStatus);

//* POST adding a new job
router.post("/add/job", addJob);

//* PUT update job by ID
router.put("/update/job/:id", updateJob);

//* DELETE job by ID
router.delete("/delete/job/:id", deleteJob);

export default router;

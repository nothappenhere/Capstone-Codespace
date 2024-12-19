import express from "express";
const router = express.Router();

import {
  getAllJobs,
  getSingleJob,
  ApplyJob,
} from "../controllers/jobController.js";

//* GET all jobs with pagination and filtering
router.get("/jobs", getAllJobs);

//* GET a single job by ID
router.get("/job/:id", getSingleJob);

//* POST user applying job
router.post("/apply", ApplyJob);

export default router;

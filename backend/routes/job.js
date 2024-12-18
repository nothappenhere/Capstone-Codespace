import express from "express";
const router = express.Router();

import { getSingleJob, getAllJobs } from "../controllers/jobController.js";

//* GET all jobs
router.get("/jobs", getAllJobs);

router.get("/job/:id", getSingleJob);

export default router;

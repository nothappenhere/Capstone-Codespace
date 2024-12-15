import express from "express";
import { getSingleJob, getAllJobs } from "../controllers/jobController.js";

const router = express.Router();

router.get("/jobs", getAllJobs);

router.get("/job/:id", getSingleJob);

export default router;

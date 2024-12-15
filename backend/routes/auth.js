import express from "express";
const router = express.Router();
import { loginUser, registUser } from "../controllers/authController.js";

//* GET user login
router.get("/login", loginUser)
//* POST registration user
router.post("/register", registUser);

export default router;

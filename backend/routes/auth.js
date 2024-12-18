import express from "express";
const router = express.Router();

import { loginUser, registerUser } from "../controllers/authController.js";
import { validateLogin, validateRegister } from "../middlewares/validation.js";

//* POST user login
router.post("/login", validateLogin, loginUser);

//* POST user registration
router.post("/register", validateRegister, registerUser);

export default router;

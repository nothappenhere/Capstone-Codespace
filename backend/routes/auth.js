import express from "express";
const router = express.Router();

import {
  loginUser,
  registerUser,
  checkEmailExist,
  resetPasswordUser,
} from "../controllers/authController.js";
import {
  validateLogin,
  validateRegister,
  checkEmail,
  validateResetPassword,
} from "../middlewares/authValidation.js";

//* POST user login
router.post("/login", validateLogin, loginUser);

//* POST user registration
router.post("/register/:role", validateRegister, registerUser);

//* POST reset password
router.post("/check-email", checkEmail, checkEmailExist);
router.post("/reset-password", validateResetPassword, resetPasswordUser);

export default router;

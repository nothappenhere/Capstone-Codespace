import express from "express";
const router = express.Router();

import {
  loginUser,
  registerUser,
  checkEmailExist,
  resetPasswordUser,
  checkCompanyDetailStatus,
  addCompanyDetails,
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

//* POST Check email exist
router.post("/check-email", checkEmail, checkEmailExist);
//* POST reset password
router.post("/reset-password", validateResetPassword, resetPasswordUser);

//* GET company details status
router.get("/company-status/:user_id", checkCompanyDetailStatus);
//* POST Add company details
router.post("/company-details", addCompanyDetails);

export default router;

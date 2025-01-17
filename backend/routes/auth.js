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
// Route untuk login user dengan validasi input
router.post("/login", validateLogin, loginUser);

//* POST user registration
// Route untuk registrasi user sesuai peran (role)
router.post("/register/:role", validateRegister, registerUser);

//* POST Check email existence
// Route untuk memeriksa apakah email sudah terdaftar
router.post("/check-email", checkEmail, checkEmailExist);

//* POST reset password
// Route untuk mereset password
router.post("/reset-password", validateResetPassword, resetPasswordUser);

//* GET company details status
// Route untuk memeriksa apakah detail perusahaan sudah diisi
router.get("/company/details/:id", checkCompanyDetailStatus);

//* POST Add company details
// Route untuk menambah detail perusahaan jika belum lengkap
router.post("/company/details", addCompanyDetails);

export default router;

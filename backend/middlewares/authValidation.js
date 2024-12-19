import { body, validationResult } from "express-validator";

export const validateLogin = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateRegister = [
  body("full_name")
    .notEmpty()
    .withMessage("Full Name is required!")
    .isLength({ min: 3 })
    .withMessage("Full Name must be at least 3 characters!"),
  body("email").isEmail().withMessage("Invalid email format!"),
  body("password")
    .notEmpty()
    .withMessage("Password is required!")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters!"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const checkEmail = [
  body("email").isEmail().withMessage("Invalid email format!"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateResetPassword = [
  body("email").isEmail().withMessage("Invalid email format!"),
  body("password")
    .notEmpty()
    .withMessage("Password is required!")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters!"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

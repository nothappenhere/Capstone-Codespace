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
  body("username")
    .notEmpty().withMessage("Username is required!")
    .isLength({ min: 6 }).withMessage("Username must be at least 6 characters!"),
  body("email")
    .isEmail().withMessage("Invalid email format!"),
  body("password")
    .notEmpty().withMessage("Password is required!")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters!"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];


import db from "../db/connection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * @desc Login user based on their role
 * @route POST /login
 */
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Query user berdasarkan email
    const [rows] = await db.promise().query(
      `SELECT users.*, companies.company_id
       FROM users
       LEFT JOIN companies ON users.user_id = companies.user_id
       WHERE users.email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        error: "Invalid credentials. Please check your email or password.",
      });
    }

    const user = rows[0];

    // Periksa kecocokan password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid credentials. Please check your email or password.",
      });
    }

    // Generate token JWT
    const token = jwt.sign(
      { userId: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        company_id: user.company_id || null,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

/**
 * @desc Register a new user with the specified role
 * @route POST /register/:role
 */
export const registerUser = async (req, res, next) => {
  const { role } = req.params;
  const { full_name, email, password } = req.body;

  try {
    // Periksa apakah email sudah terdaftar
    const [existingUser] = await db
      .promise()
      .query("SELECT email FROM users WHERE email = ?", [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Email is already registered." });
    }

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru ke database
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)",
        [full_name, email, hashedPassword, role]
      );

    res.status(201).json({
      message: "User registered successfully.",
      user_id: result.insertId,
    });
  } catch (error) {
    console.error("Registration error:", error);
    next(error);
  }
};

/**
 * @desc Check if the given email is already registered
 * @route POST /check-email
 */
export const checkEmailExist = async (req, res, next) => {
  const { email } = req.body;

  try {
    const [result] = await db
      .promise()
      .query("SELECT email FROM users WHERE email = ?", [email]);

    if (result.length === 0) {
      return res.status(200).json({ exists: false });
    }

    res.status(200).json({ exists: true });
  } catch (error) {
    console.error("Email check error:", error);
    next(error);
  }
};

/**
 * @desc Reset the user's password
 * @route POST /reset-password
 */
export const resetPasswordUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Hash password baru
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password di database
    const [result] = await db
      .promise()
      .query("UPDATE users SET password = ? WHERE email = ?", [
        hashedPassword,
        email,
      ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Email not found." });
    }

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Password reset error:", error);
    next(error);
  }
};

/**
 * @desc Check if the user has completed their company details
 * @route GET /company-status/:user_id
 */
export const checkCompanyDetailStatus = async (req, res, next) => {
  const { user_id } = req.params;

  try {
    const [result] = await db
      .promise()
      .query("SELECT company_id FROM companies WHERE user_id = ?", [user_id]);

    if (result[0]) {
      res.status(200).json({ isComplete: true });
    } else {
      res.status(200).json({ isComplete: false });
    }

    // res.status(200).json({
    //   companyDetailsFilled: result.length > 0,
    // });
  } catch (error) {
    console.error("Company detail status check error:", error);
    next(error);
  }
};

/**
 * @desc Add or update company details for a user
 * @route POST /company/details/add
 */
export const addCompanyDetails = async (req, res, next) => {
  const { user_id, name, description, email, location } = req.body;

  try {
    // Periksa apakah user sudah memiliki detail perusahaan
    const [existingCompany] = await db
      .promise()
      .query("SELECT company_id FROM companies WHERE user_id = ?", [user_id]);

    if (existingCompany.length > 0) {
      // Update detail perusahaan jika sudah ada
      await db.promise().query(
        `UPDATE companies
         SET name = ?, description = ?, email = ?, location = ?
         WHERE user_id = ?`,
        [name, description, email, location, user_id]
      );

      return res.status(200).json({ message: "Company details updated." });
    }

    // Tambahkan detail perusahaan baru
    await db.promise().query(
      `INSERT INTO companies (user_id, name, description, email, location)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, name, description, email, location]
    );

    res.status(201).json({ message: "Company details added." });
  } catch (error) {
    console.error("Add company details error:", error);
    next(error);
  }
};

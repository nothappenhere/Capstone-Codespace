import db from "../db/connection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
  @desc   Login user based on their role
  @route  POST /login/:role
*/
export const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  // Ambil user berdasarkan email
  db.query(
    `SELECT users.*, companies.company_id
     FROM users
     LEFT JOIN companies ON users.user_id = companies.user_id
     WHERE users.email = ?`,
    [email],
    async (err, result) => {
      if (err || result.length === 0) {
        return res.status(401).json({
          error: "Invalid credentials, please check your email or password.",
        });
      }

      const user = result[0];
      try {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({
            error: "Invalid credentials, please check your email or password.",
          });
        }

        // Buat token JWT
        const token = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" } // Token berlaku selama 1 jam
        );

        res.status(200).json({
          message: "Login successful",
          token, // Kembalikan token ke frontend
          user: {
            id: user.user_id,
            email: user.email,
            role: user.role,
            company_id: user.company_id || null, // Tambahkan company_id jika ada
          },
        });
      } catch (err) {
        next(err);
      }
    }
  );
};

/**
  @desc   Registration user based on their role
  @route  POST /register/:role
*/
export const registerUser = async (req, res, next) => {
  const { full_name, email, password } = req.body;
  const role = req.params.role;

  try {
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database query failed" });
      }
      if (result.length > 0) {
        return res.status(400).json({ error: "Email already in use" });
      }

      // Lanjutkan menyimpan user
      const saltRounds = 10;
      bcrypt.hash(password, saltRounds, (hashErr, hashedPassword) => {
        if (hashErr) {
          return res.status(500).json({ error: "Password hashing failed" });
        }

        db.query(
          "INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)",
          [full_name, email, hashedPassword, role],
          (insertErr, insertResult) => {
            if (insertErr) {
              return res.status(500).json({ error: "Database insert failed" });
            }
            res.status(201).json({ message: "User registered successfully" });
          }
        );
      });
    });
  } catch (err) {
    next(err);
  }
};

/**
  @desc   Check email exist for reset password
  @route  POST /check-email
*/
export const checkEmailExist = (req, res, next) => {
  const { email } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database query failed" });
    }
    if (result.length === 0) {
      return res.status(200).json({
        message: "If the email exists, you will receive further instructions.",
        exists: false,
      });
    }
    res.status(200).json({ message: "Email found", exists: true });
  });
};

/**
  @desc   Continue reset password if email exist
  @route  POST /reset-password
*/
export const resetPasswordUser = (req, res, next) => {
  const { email, password } = req.body;

  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, (hashErr, hashedPassword) => {
    if (hashErr) {
      return res.status(500).json({ error: "Password hashing failed" });
    }

    db.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, email],
      (updateErr, result) => {
        if (updateErr) {
          return res.status(500).json({ error: "Database update failed" });
        }
        res.status(200).json({ message: "Password reset successfully" });
      }
    );
  });
};

/**
  @desc   Check company detail status exist
  @route  GET /company-status/:user_id
*/
export const checkCompanyDetailStatus = async (req, res, next) => {
  const { user_id } = req.params;

  // Validasi input
  if (!user_id) {
    return res.status(400).json({ message: "User ID are required." });
  }

  db.query(
    `
    SELECT * FROM companies WHERE user_id = ?;
  `,
    [user_id],
    (err, result) => {
      if (err) {
        console.error("Database Error:", err.message);
        return res
          .status(500)
          .json({ message: "Error checking company details status" });
      }

      if (result[0]) {
        res.status(200).json({ isComplete: true });
      } else {
        res.status(200).json({ isComplete: false });
      }
    }
  );
};

/**
  @desc   Add company details if status false
  @route  POST /company-details
*/
export const addCompanyDetails = (req, res, next) => {
  const { name, description, email, location, user_id } = req.body;

  // Validasi input
  if (!name || !description || !email || !location) {
    return res.status(400).json({ message: "All fields are required." });
  }

  db.query(
    `
    INSERT INTO companies (name, description, email, location, user_id)
    VALUES (?, ?, ?, ?, ?)
  `,
    [name, description, email, location, user_id],
    (err, result) => {
      if (err) {
        console.error("Database Error:", err.message);
        return res
          .status(500)
          .json({ message: "Failed to add company details." });
      }

      // Berhasil menambahkan data
      res.status(201).json({
        message: "Company Details Added Successfully",
        id: result.insertId, // ID perusahaan yang baru dibuat
      });
    }
  );
};

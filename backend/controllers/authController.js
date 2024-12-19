import bcrypt from "bcrypt";
import db from "../db/connection.js";
import jwt from "jsonwebtoken";

/**
  @desc   Login user based on their role
  @route  POST /login/:role
*/
export const loginUser = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  // Ambil user berdasarkan email
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err || result.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const user = result[0];
      try {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ error: "Invalid credentials" });
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
            full_name: user.full_name,
            email: user.email,
            role: user.role,
          },
        });
      } catch (err) {
        next(err);
      }
    }
  );
};

/**
  @desc   Register user based on their role
  @route  POST /register/:role
*/
export const registerUser = async (req, res, next) => {
  const full_name = req.body.full_name;
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role || "user";

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
  const email = req.body.email;
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

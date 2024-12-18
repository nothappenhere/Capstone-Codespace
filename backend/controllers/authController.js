import bcrypt from "bcrypt";
import db from "../db/connection.js";
import jwt from "jsonwebtoken";

/**
  @desc   Login user
  @route  POST /login
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
          user: { id: user.user_id, email: user.email },
        });
      } catch (err) {
        next(err);
      }
    }
  );
};

/**
  @desc   Register user
  @route  POST /register
*/
export const registerUser = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

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
          "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
          [username, email, hashedPassword],
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

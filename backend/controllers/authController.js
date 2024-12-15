import bcrypt from "bcrypt";
import db from "../db/connection.js";

/**
  @desc   Login user
  @route  GET /login
*/
export const loginUser = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    const error = new Error("Required email and password!");
    error.status = 400;
    return next(error);
  }

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
        // Bandingkan password dengan hash di database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successful", userId: user.id });
      } catch (err) {
        next(err);
      }
    }
  );
};

/**
  @desc   Create new user
  @route  POST /register
*/
export const registUser = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  if (!username || !email || !password) {
    const error = new Error("Required username, email, and password!");
    error.status = 400;
    return next(error);
  }

  try {
    // Hash password dengan bcrypt
    const saltRounds = 10; // Semakin besar nilainya, semakin aman tapi lebih lambat
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Simpan ke database
    db.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Database query failed" });
        }

        res.status(201).json({ message: "User registered successfully" });
      }
    );
  } catch (err) {
    next(err);
  }
};

import jwt from "jsonwebtoken";

// Fungsi middleware untuk otentikasi pengguna
export const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", ""); // Mengambil token dari header

  if (!token) {
    return res.status(401).json({ error: "Authentication token is missing." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifikasi token
    req.user = decoded; // Menyimpan data pengguna pada objek request
    next(); // Melanjutkan ke middleware atau route handler berikutnya
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

// Fungsi middleware untuk otorisasi berdasarkan role
export const authorizeRole = (roles) => (req, res, next) => {
  // `roles` adalah array yang berisi role yang diizinkan untuk mengakses route ini
  if (!roles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ error: "Access denied. You don't have permission." });
  }
  next();
};

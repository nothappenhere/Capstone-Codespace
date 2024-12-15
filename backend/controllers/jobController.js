import db from "../db/connection.js";

export const getAllJobs = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const { location, type } = req.query;

  let query = "SELECT * FROM jobs WHERE 1=1";
  const params = [];

  // Filter berdasarkan lokasi
  if (location) {
    query += " AND location LIKE ?";
    params.push(`%${location}%`);
  }

  if (type) {
    query += " AND type LIKE ?";
    params.push(`%${type}%`);
  }

  query += " ORDER BY created_at ASC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Database Error:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.status(200).json({
      data: result,
      page,
      limit,
    });
  });
};

export const getSingleJob = (req, res, next) => {
  const id = parseInt(req.params.id);

  // Validasi ID
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid job ID" });
  }

  db.query("SELECT * FROM jobs WHERE job_id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database query failed" });
    }

    // Cek apakah pekerjaan ditemukan
    if (result.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Mengembalikan pekerjaan yang ditemukan
    res.status(200).json(result[0]); // Mengambil job pertama dari hasil query
  });
};


import db from "../db/connection.js";

/**
  @desc   Getting all jobs with pagination and filtering
  @route  GET /jobs
*/
export const getAllJobs = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const { location, type } = req.query;

  let query = "SELECT * FROM jobs WHERE 1=1";
  const params = [];

  if (location) {
    query += " AND location LIKE ?";
    params.push(`%${location}%`);
  }

  if (type) {
    query += " AND type LIKE ?";
    params.push(`%${type}%`);
  }

  query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Database Error:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.status(200).json({
      jobs: result,
      pagination: { page, limit },
    });
  });
};

/**
  @desc   Getting single job with associated company based on job ID
  @route  GET /job/:id
*/
export const getSingleJob = (req, res, next) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid job ID" });
  }

  db.query(
    `SELECT jobs.*,
    companies.name AS company_name,
	  companies.description AS company_description,
    companies.email AS company_email,
    companies.location AS company_location
      FROM jobs
      JOIN companies ON jobs.company_id = companies.company_id
      WHERE jobs.job_id = ? LIMIT 1`,
    [id],
    (err, result) => {
      if (err) {
        console.error("Database Error:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Menggabungkan data pekerjaan dan perusahaan dalam satu objek
      const jobData = result[0];
      const job = {
        job_id: jobData.job_id,
        title: jobData.title,
        type: jobData.type,
        description: jobData.description,
        location: jobData.location,
        salary: jobData.salary,
        company: {
          company_id: jobData.company_id,
          name: jobData.company_name,
          description: jobData.company_description,
          email: jobData.company_email,
          location: jobData.company_location,
        },
      };

      res.status(200).json({ job });
    }
  );
};

/**
  @desc   User applying for a job
  @route  POST /apply
*/
export const ApplyJob = (req, res, next) => {
  const { job_id, user_id } = req.body;

  // Validasi input
  if (!job_id || !user_id) {
    return res.status(400).json({ error: "Job ID and User ID are required" });
  }

  // Cek apakah user sudah melamar pekerjaan ini
  db.query(
    "SELECT * FROM job_applications WHERE job_id = ? AND user_id = ? LIMIT 1",
    [job_id, user_id],
    (err, result) => {
      if (err) {
        console.error("Database Error:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Jika sudah ada aplikasi untuk job_id yang sama
      if (result.length > 0) {
        return res
          .status(400)
          .json({ message: "You have already applied for this job." });
      }

      // Ambil company_id dari tabel jobs
      db.query(
        "SELECT company_id FROM jobs WHERE job_id = ? LIMIT 1",
        [job_id],
        (err, result) => {
          if (err) {
            console.error("Database Error:", err.message);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          if (result.length === 0) {
            return res.status(404).json({ error: "Job not found" });
          }

          const company_id = result[0].company_id;

          // Insert data ke tabel job_applications
          db.query(
            "INSERT INTO job_applications (job_id, company_id, user_id, status) VALUES (?, ?, ?, ?)",
            [job_id, company_id, user_id, "pending"],
            (err, result) => {
              if (err) {
                console.error("Database Error:", err.message);
                return res.status(500).json({ error: "Internal Server Error" });
              }

              res.status(200).json({
                message: "Successfully applied for the job",
                application_id: result.insertId,
              });
            }
          );
        }
      );
    }
  );
};

/**
  @desc   Application history for user or company
  @route  GET /apply/history/:id
*/
export const getApplicationHistory = (req, res) => {
  const id = parseInt(req.params.id);
  const role = req.query.role; // Ambil role dari query parameter

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  if (!role) {
    return res.status(400).json({ error: "Role is required" });
  }

  let query = "";
  let queryParams = [];

  if (role === "user") {
    // Query untuk pengguna
    query = `
      SELECT
        job_applications.*,
        jobs.title AS job_title,
        jobs.type AS job_type,
        jobs.description AS job_description,
        jobs.location AS job_location,
        jobs.salary AS job_salary,
        companies.name AS company_name,
        companies.email AS company_email
      FROM
        job_applications
      JOIN
        jobs ON job_applications.job_id = jobs.job_id
      JOIN
        companies ON jobs.company_id = companies.company_id
      WHERE
        job_applications.user_id = ?;
    `;
    queryParams = [id];
  } else if (role === "company") {
    // Query untuk perusahaan
    query = `
      SELECT
        job_applications.*,
        jobs.title AS job_title,
        jobs.type AS job_type,
        jobs.description AS job_description,
        jobs.location AS job_location,
        jobs.salary AS job_salary,
        users.full_name AS applicant_name,
        users.email AS applicant_email
      FROM
        job_applications
      JOIN
        jobs ON job_applications.job_id = jobs.job_id
      JOIN
        users ON job_applications.user_id = users.user_id
      WHERE
        jobs.company_id = ?;
    `;
    queryParams = [id];
  } else {
    return res.status(400).json({ error: "Invalid role" });
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Database Error:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: `No applications found for the given ID and role`,
      });
    }

    res.status(200).json({ apply_history: results });
  });
};

/**
  @desc   Adding a new job
  @route  POST /add/job
*/
export const addJob = (req, res, next) => {
  const { title, type, description, location, salary, company_id } = req.body;

  // Validasi data input
  if (!title || !type || !description || !location || !salary || !company_id) {
    return res
      .status(400)
      .json({ error: "All fields are required, including company ID." });
  }

  // Jalankan query insert pekerjaan
  db.query(
    "INSERT INTO jobs (title, type, description, location, salary, company_id) VALUES (?, ?, ?, ?, ?, ?)",
    [title, type, description, location, salary, company_id],
    (err, result) => {
      if (err) {
        console.error("Database Error:", err.message);
        return res.status(500).json({ error: "Failed to add job." });
      }

      // Kirimkan respon jika query berhasil
      res.status(200).json({
        message: "Job successfully added",
        id: result.insertId, // ID dari pekerjaan yang baru ditambahkan
      });
    }
  );
};

/**
  @desc   Update job by ID
  @route  DELETE /delete/job/:id
*/
export const updateJob = (req, res, next) => {
  const jobId = parseInt(req.params.id);

  // Validasi ID
  if (isNaN(jobId) || jobId <= 0) {
    return res.status(400).json({ error: "Invalid Job ID" });
  }

  // Data yang akan diperbarui
  const { title, type, description, location, salary } = req.body;

  // Validasi data input
  if (!title || !type || !description || !location || !salary) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Query untuk memperbarui pekerjaan
  const updateJobQuery = `
    UPDATE jobs
    SET title = ?, type = ?, description = ?, location = ?, salary = ?, updated_at = NOW()
    WHERE job_id = ?;
  `;

  // Jalankan query update pekerjaan
  db.query(
    updateJobQuery,
    [title, type, description, location, salary, jobId],
    (err, result) => {
      if (err) {
        console.error("Database Error:", err.message);
        return res.status(500).json({ error: "Failed to update job details" });
      }

      res.status(200).json({ msg: "Job successfully updated", id: jobId });
    }
  );
};

/**
  @desc   Delete job by ID
  @route  DELETE /delete/job/:id
*/
export const deleteJob = (req, res, next) => {
  const jobId = parseInt(req.params.id);

  if (isNaN(jobId) || jobId <= 0) {
    return res.status(400).json({ error: "Invalid Job ID" });
  }

  db.query("SELECT * FROM jobs WHERE job_id = ?", [jobId], (err, results) => {
    if (err) {
      console.error("Database Error:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    db.query("DELETE FROM jobs WHERE job_id = ?", [jobId], (err, result) => {
      if (err) {
        console.error("Database Error:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      res.status(200).json({ msg: "Job successfully deleted" });
    });
  });
};

export const updateJobStatus = async (req, res, next) => {
  const { id, status } = req.body;

  // Validasi data input
  if (!id || !status) {
    return res.status(400).json({ message: "Invalid data provided" });
  }

  // Query database untuk memperbarui status
  db.query(
    "UPDATE job_applications SET status = ? WHERE job_id = ?",
    [status, id],
    (err, result) => {
      if (err) {
        console.error("Database Error:", err.message);
        return res.status(500).json({ error: "Failed to update job status" });
      }

      // Periksa apakah ada baris yang diperbarui
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Job application not found" });
      }

      res.status(200).json({ message: "Job status updated successfully" });
    }
  );
};

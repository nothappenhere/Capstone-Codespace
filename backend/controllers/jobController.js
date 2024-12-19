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

  query += " ORDER BY created_at ASC LIMIT ? OFFSET ?";
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
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid job ID" });
  }

  db.query(
    `SELECT jobs.*, companies.*
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
          name: jobData.name,
          description: jobData.description,
          contact_info: jobData.contact_info,
          created_at: jobData.created_at,
          updated_at: jobData.updated_at,
        },
      };

      res.status(200).json({ job });
    }
  );
};

/**
  @desc   Apply for a job
  @route  POST /apply
*/
export const ApplyJob = (req, res, next) => {
  const job_id = parseInt(req.body.job_id);
  const user_id = parseInt(req.body.user_id);

  // Validasi input
  if (!job_id || !user_id) {
    return res.status(400).json({ error: "Job ID and User ID are required" });
  }

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
};

// SELECT
//     job_applications.*,
//     jobs.title AS job_title,
// 	jobs.description AS job_description,
//     jobs.salary AS job_salary,
//     companies.name AS company_name,
//     companies.description AS company_description,
//     companies.contact_info AS company_contact_info,
//     users.full_name AS full_name,
//     users.email AS user_email
// FROM
//     job_applications
// JOIN
//     jobs ON job_applications.job_id = jobs.job_id
// JOIN
//     companies ON job_applications.company_id = companies.company_id
// JOIN
//     users ON job_applications.user_id = users.user_id;

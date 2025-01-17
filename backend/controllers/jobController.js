import db from "../config/database.js";

/**
 * @desc   Getting all jobs with pagination and filtering
 * @route  GET /jobs
 */
export const getAllJobs = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
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

  try {
    const [result] = await db.promise().query(query, params);

    if (result.length === 0) {
      return res.status(404).json({
        error: "No jobs found.",
      });
    }

    res.status(200).json({
      message: "All available jobs.",
      data: result,
      pagination: { page, limit },
    });
  } catch (error) {
    console.error("Error when getting a job list:", error);
    next(error);
  }
};

/**
 * @desc   Getting single job with associated company based on job ID
 * @route  GET /jobs/:id
 */
export const getSingleJob = async (req, res, next) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid job ID." });
  }

  try {
    const [result] = await db.promise().query(
      `SELECT jobs.*,
      companies.name AS company_name,
      companies.description AS company_description,
      companies.email AS company_email,
      companies.location AS company_location
        FROM jobs
        JOIN companies ON jobs.company_id = companies.company_id
        WHERE jobs.job_id = ? LIMIT 1`,
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({
        error: "No jobs found.",
      });
    }

    res.status(200).json({
      message: `Get a job with id ${id}`,
      data: result[0],
    });
  } catch (error) {
    console.error("Error when getting a job list:", error);
    next(error);
  }
};

/**
 * @desc   User applying for a job
 * @route  POST /jobs/apply
 */
export const applyJob = async (req, res, next) => {
  const { job_id, user_id } = req.body;

  // Validasi input
  if (!job_id || !user_id || isNaN(job_id) || isNaN(user_id)) {
    return res
      .status(400)
      .json({ error: "Valid Job ID and User ID are required." });
  }

  try {
    // Cek apakah user sudah melamar pekerjaan
    const [existingJob] = await db
      .promise()
      .query(
        "SELECT * FROM job_applications WHERE job_id = ? AND user_id = ? LIMIT 1",
        [job_id, user_id]
      );

    if (existingJob.length > 0) {
      return res.status(400).json({
        error: `User with id ${user_id} have already applied for this job id ${job_id}.`,
      });
    }

    // Ambil company_id dari tabel jobs
    const [companyId] = await db
      .promise()
      .query("SELECT company_id FROM jobs WHERE job_id = ? LIMIT 1", [job_id]);

    if (companyId.length === 0) {
      return res.status(404).json({ error: "No jobs found." });
    }
    const company_id = companyId[0].company_id;

    // Simpan aplikasi pekerjaan
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO job_applications (job_id, company_id, user_id, status) VALUES (?, ?, ?, ?)",
        [job_id, company_id, user_id, "pending"]
      );

    res.status(200).json({
      message: `Successfully applied for the job id ${job_id}`,
      application_id: result.insertId,
    });
  } catch (error) {
    console.error("Error when applying a job:", error);
    next(error);
  }
};

/**
 * @desc   Application history for user or company
 * @route  GET /jobs/apply/:id
 */
export const getApplicationHistory = async (req, res, next) => {
  const id = parseInt(req.params.id);
  const role = req.query.role;

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid User ID." });
  }

  if (!role) {
    return res.status(400).json({ error: "Role is required." });
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
    return res.status(400).json({ error: "Invalid role." });
  }

  try {
    const [results] = await db.promise().query(query, queryParams);

    if (results.length === 0) {
      return res.status(404).json({
        error: `No applications found for the given id ${id} and role ${role}.`,
      });
    }

    res.status(200).json({
      message: `Applications history for user id ${id} and role ${role}.`,
      data: results,
    });
  } catch (error) {
    console.error("Error when searching for job history:", error);
    next(error);
  }
};

/**
 * @desc   Adding a new job
 * @route  POST /jobs/add
 */
export const addingJob = async (req, res, next) => {
  const { title, type, description, location, salary, company_id } = req.body;

  // Validasi Input
  if (!title || !type || !description || !location || !salary || !company_id) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (isNaN(salary) || salary <= 0) {
    return res.status(400).json({ error: "Salary must be a positive number." });
  }

  try {
    // Periksa apakah company_id valid
    const [companyExists] = await db
      .promise()
      .query("SELECT * FROM companies WHERE company_id = ? LIMIT 1", [
        company_id,
      ]);

    if (companyExists.length === 0) {
      return res
        .status(404)
        .json({ error: `Company with ID ${company_id} not found.` });
    }

    // Tambahkan pekerjaan baru
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO jobs (title, type, description, location, salary, company_id) VALUES (?, ?, ?, ?, ?, ?)",
        [title, type, description, location, salary, company_id]
      );

    res.status(201).json({
      message: `Successfully added a new job.`,
      job_id: result.insertId,
    });
  } catch (error) {
    console.error("Error when attempting to add a new job:", error);
    next(error);
  }
};

/**
 * @desc   Update job by ID
 * @route  PUT /jobs/update/:id
 */
export const updateJob = async (req, res, next) => {
  const id = parseInt(req.params.id);
  const { title, type, description, location, salary } = req.body;

  // Validasi ID
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid Job ID." });
  }

  // Validasi Input
  if (!title && !type && !description && !location && !salary) {
    return res
      .status(400)
      .json({ error: "At least one field is required to update." });
  }

  if (salary && (isNaN(salary) || salary <= 0)) {
    return res.status(400).json({ error: "Salary must be a positive number." });
  }

  try {
    // Periksa apakah pekerjaan dengan ID tersebut ada
    const [jobExists] = await db
      .promise()
      .query("SELECT * FROM jobs WHERE job_id = ? LIMIT 1", [id]);

    if (jobExists.length === 0) {
      return res.status(404).json({ error: `Job with ID ${id} not found.` });
    }

    // Build Query Dinamis
    const fields = [];
    const values = [];
    if (title) fields.push("title = ?"), values.push(title);
    if (type) fields.push("type = ?"), values.push(type);
    if (description) fields.push("description = ?"), values.push(description);
    if (location) fields.push("location = ?"), values.push(location);
    if (salary) fields.push("salary = ?"), values.push(salary);

    // Tambahkan updated_at
    fields.push("updated_at = NOW()");
    values.push(id);

    const query = `UPDATE jobs SET ${fields.join(", ")} WHERE job_id = ?`;

    // Eksekusi Query
    const [result] = await db.promise().query(query, values);

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: "No changes were made." });
    }

    res.status(200).json({
      message: "Job details updated successfully.",
      job_id: id,
    });
  } catch (error) {
    console.error("Error when updating job details:", error);
    next(error);
  }
};

/**
 * @desc   Delete job by ID
 * @route  DELETE /jobs/delete/:id
 */
export const deleteJob = async (req, res, next) => {
  const jobId = parseInt(req.params.id);

  // Validasi ID
  if (isNaN(jobId) || jobId <= 0) {
    return res.status(400).json({ error: "Invalid Job ID" });
  }

  try {
    // Periksa apakah pekerjaan dengan ID tersebut ada
    const [job] = await db
      .promise()
      .query("SELECT * FROM jobs WHERE job_id = ?", [jobId]);

    if (job.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Hapus pekerjaan
    const [result] = await db
      .promise()
      .query("DELETE FROM jobs WHERE job_id = ?", [jobId]);

    // Periksa apakah penghapusan berhasil
    if (result.affectedRows === 0) {
      return res.status(400).json({ error: "Failed to delete the job" });
    }

    res.status(200).json({ message: "Job successfully deleted" });
  } catch (error) {
    console.error("Error when deleting job:", error);
    next(error);
  }
};

/**
 * @desc   Update job application status
 * @route  PUT /jobs/update/status
 */
export const updateJobStatus = async (req, res, next) => {
  const { id, status } = req.body;

  // Validasi data input
  if (!id || !status) {
    return res.status(400).json({ error: "Invalid data provided" });
  }

  try {
    // Periksa apakah job application dengan ID tersebut ada
    const [application] = await db
      .promise()
      .query("SELECT * FROM job_applications WHERE job_id = ?", [id]);

    if (application.length === 0) {
      return res.status(404).json({ error: "Job application not found" });
    }

    // Update status job application
    const [result] = await db
      .promise()
      .query("UPDATE job_applications SET status = ? WHERE job_id = ?", [
        status,
        id,
      ]);

    // Periksa apakah pembaruan berhasil
    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ error: "Failed to update job application status" });
    }

    res
      .status(200)
      .json({ message: "Job application status updated successfully" });
  } catch (error) {
    console.error("Error when updating job application status:", error);
    next(error);
  }
};

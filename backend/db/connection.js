import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "job_portal",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL Database");
});

export default connection;

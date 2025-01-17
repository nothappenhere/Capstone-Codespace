import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import logger from "./middlewares/logger.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFound from "./middlewares/notFound.js";
import auth from "./routes/auth.js";
import jobs from "./routes/job.js";

const app = express();

//* Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//* logger
app.use(logger);

//* routes
app.use("/", [auth, jobs]);

//* Error Handling
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server running in http://localhost:${process.env.PORT}`);
});

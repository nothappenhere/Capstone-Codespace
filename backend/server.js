import express from "express";
import cors from "cors";

import logger from "./middlewares/logger.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFound from "./middlewares/notFound.js";
import auth from "./routes/auth.js";
import jobs from "./routes/jobs.js";

const app = express();

//* Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(logger);

//* routes
app.use("/", [auth, jobs]);

//* Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});

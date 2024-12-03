const OS = require("os");
const path = require("path");

require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const { createSpinner } = require("nanospinner");
const figlet = require("figlet");
const gradient = require("gradient-string");

const protect = require("./middlewares/appProtectMiddleware");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const dbConnection = require("./config/database");

// Routes
const mountRoutes = require("./routes");

(async function () {
  // Express app
  const app = express();

  // Console cleaning
  console.clear();

  // Show in the console the name of the application
  console.log(
    gradient.pastel.multiline(
      figlet.textSync("Craftoria", {
        horizontalLayout: "full",
      })
    )
  );

  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
    console.log(`Mode: ${process.env.NODE_ENV}`);
  } else {
    process.env.UV_THREADPOOL_SIZE = OS.cpus().length;
  }

  const CORES = process.env.UV_THREADPOOL_SIZE;
  if (CORES) {
    console.log(`App running on ${CORES}/${OS.cpus().length} CPU cores`);
  }

  // Connect to db
  await dbConnection();

  // App protect middleware
  protect(app);

  // Compress all responses
  app.use(compression());

  // Middlewares
  app.use(express.json({ limit: "20kb" }));
  app.use(express.static(path.join(__dirname, "uploads")));

  // Mount routes
  mountRoutes(app);

  app.all("*", (req, res, next) => {
    next(new ApiError(`Con't find this route: ${req.originalUrl}`, 400));
  });

  app.use(globalError);

  // Start server
  const PORT = process.env.PORT || 8000;
  const spinner = createSpinner("Run App").start();
  const server = app.listen(PORT, () => {
    spinner.success({ text: `App listening on port ${PORT}` });
  });

  process.on("unhandledRejection", (err) => {
    console.error(`UnhandledRejection Error: ${err.name} | ${err.message}`);
    server.close(() => {
      console.error(`Shutting down...`);
      process.exit(1);
    });
  });
})();

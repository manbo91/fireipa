import express from "express";
// import path from 'path';
import logger from "morgan";
import bodyParser from "body-parser";
import cors from "cors";

// routes
import index from "./routes/index";
import users from "./routes/users";

const app = express();
app.disable("x-powered-by");

// View engine setup
app.set("view engine", "html");

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(
  logger("dev", {
    skip: () => app.get("env") === "test"
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use("/", index);
app.use("/users", users);

// Catch 404 and forward to error handler
// app.use((req, res, next) => {
//   const err = new Error("Not Found");
//   err.status = 404;
//   next(err);
// });

// Error handler
app.use((err, req, res, /* next */) => {
  // eslint-disable-line no-unused-vars
  res.status(err.status || 500).render("error", {
    message: err.message
  });
});

export default app;

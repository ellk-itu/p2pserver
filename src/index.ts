import express, { type ErrorRequestHandler } from "express";
import config from "./config";
import processHandling from "./processHandling";
import createPeerServer from "./createPeerServer";
import addMiddleware from "./addMiddleware";
import path from "node:path";

// ===== Setup =====
processHandling();

// ===== Server =====
const app = express();
const server = app.listen(config.PORT, () => {
  if (config.LOGGING) {
    console.log(
      `\x1b[1mExpress server mounted on port ${config.PORT}\x1b[0m \n`,
    );
  }
});

app.post("/auth/register", (req, res) => {
  const { email, password } = req.body;

  res.sendStatus(500);
});

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  res.sendStatus(500);
});

app.post("/auth/logout", (req, res) => {
  res.sendStatus(500);
});

app.get("/docs/openapi", (req, res) => {
  //TODO add response when no docs have been generated
  res.status(200).sendFile(path.join(process.cwd() + "/static/openapi.html"));
});

app.get("/users/me", (req, res) => {
  res.sendStatus(500);
});

app.delete("/users/me", (req, res) => {
  res.sendStatus(500);
});

console.log("\x1b[3m");
addMiddleware(app, server);
console.log("\x1b[0m");

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
};
app.use(errorHandler);

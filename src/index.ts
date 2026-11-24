import express from "express";
import config from "./config";
import processHandling from "./processHandling";
import createPeerServer from "./createPeerServer";
import addMiddleware from "./addMiddleware";

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

console.log("\x1b[3m");
addMiddleware(app, server);
console.log("\x1b[0m");

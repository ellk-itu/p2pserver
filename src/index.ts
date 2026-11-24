import express, { json } from "express";
import { ExpressPeerServer } from "peer";
import cors from "cors";
import * as OpenAPIValidator from "express-openapi-validator";
import config from "./config";


process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

const port = config.PORT;
const app = express();
const server = app.listen(port, () => {
  console.log(`\x1b[1mExpress server mounted on port ${port}\x1b[0m \n`);
});

const peerServer = ExpressPeerServer(server, {
  allow_discovery: true,
  host: config.HOST,
  port: port,
  path: config.PEER_PATH,
});

peerServer.once("mount", () => {
  console.log("Peer server mounted");
});

peerServer.on("connection", (peer) => {
  console.log(`${peer.getId()} connected`);
});

peerServer.on("disconnect", (peer) => {
  console.log(`${peer.getId()} disconnected`);
});

peerServer.on("error", (e) => {
  console.error("An error occurred");
  console.error(e.message);
});

console.log("\x1b[3m");
console.log(`Created peer server`);

app.use(cors());
console.log(`Added cors middleware`);

app.use(json());
console.log(`Added JSON middleware`);

app.use(
  OpenAPIValidator.middleware({
    apiSpec: "./openAPI.yaml",
    validateRequests: true,
    validateResponses: true,
  }),
);
console.log(`Added OpenAPI validation middleware`);

app.use("/", peerServer);
console.log(`Added Peer Server middleware`);
console.log("\x1b[0m");

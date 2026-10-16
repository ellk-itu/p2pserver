import express, { json } from "express";
import { ExpressPeerServer } from "peer";
import cors from "cors";

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

const port = 3000;
const app = express();
const server = app.listen(port, () => {
  console.log(`\x1b[1mExpress server mounted on port ${port}\x1b[0m \n`);
});

app.get("/", (_, res) => {
  res.status(200).json({ message: "Hello this is the server" });
});

const peerServer = ExpressPeerServer(server, {
  allow_discovery: true, 
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
  console.error("An error occured");
  console.error(e.message);
});

console.log("\x1b[3m");
console.log(`Created peer server`);

app.use(cors());
console.log(`Added cors middleware`);

app.use(json());
console.log(`Added JSON middleware`);

app.use("/", peerServer);
console.log(`Added Peer Server middleware`);
console.log("\x1b[0m");

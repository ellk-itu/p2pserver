import { readFileSync } from "node:fs";
import { PeerServer } from "peer";

const key = readFileSync("./private.key").toString();
const cert = readFileSync("./certificate.crt").toString();

const server = PeerServer({
  port: 6969,
  path: "/p2p",
  allow_discovery: true,
  ssl: { key: key, cert: cert },
});

console.log(`
    Server Running
    key is ${key}
    `);

server.on("connection", (client) => {
  console.log("Client connected:", client.getId());
});

server.on("disconnect", (client) => {
  console.log("Client disconnected:", client.getId());
});

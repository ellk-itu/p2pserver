import { PeerServer } from "peer";

const server = PeerServer({ port: 6969, path: "/p2p", allow_discovery: true });

server.on("connection", (client) => {
  console.log("Client connected:", client.getId());
});

server.on("disconnect", (client) => {
  console.log("Client disconnected:", client.getId());
});

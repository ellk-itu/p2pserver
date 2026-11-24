import type { Server } from "node:http";
import { ExpressPeerServer } from "peer";
import config from "./config";

/**
 * Creates and sets up listeners to the peer server
 * @param server The express server.
 * @returns Peer server.
 */
const createPeerServer = (server: Server) => {
  const peerServer = ExpressPeerServer(server, {
    allow_discovery: true,
    host: config.HOST,
    port: config.PORT,
    path: config.PEER_PATH,
  });

  // Verbose logging
  if (config.LOGGING && config.VERBOSE) {
    peerServer.once("mount", () => {
      console.log("Peer server mounted");
    });

    peerServer.on("connection", (peer) => {
      console.log(`${peer.getId()} connected`);
    });

    peerServer.on("disconnect", (peer) => {
      console.log(`${peer.getId()} disconnected`);
    });

    console.log(`Created peer server`);
  }

  // Default Logging
  if (config.LOGGING) {
    peerServer.on("error", (e) => {
      console.error("An error occurred");
      console.error(e.message);
    });
  }

  return peerServer;
};

export default createPeerServer;

import { json, type Express } from "express";
import cors from "cors";
import * as OpenAPIValidator from "express-openapi-validator";
import config from "./config";
import type { Server } from "node:http";
import createPeerServer from "./createPeerServer";
import { expressjwt } from "express-jwt";

const addMiddleware = (app: Express, server: Server) => {
  if (!config.JWT_SECRET) {
    console.error("No JWT Secret set. Set the environment variable JWT_SECRET");
    process.exit(1);
  }

  const peerServer = createPeerServer(server);

  app.use(cors());
  if (config.LOGGING && config.VERBOSE) console.log(`Added cors middleware`);

  app.use(json());
  if (config.LOGGING && config.VERBOSE) console.log(`Added JSON middleware`);

  app.use(
    OpenAPIValidator.middleware({
      apiSpec: "./openAPI.yaml",
      validateRequests: true,
      validateResponses: true,
    }),
  );
  if (config.LOGGING && config.VERBOSE)
    console.log(`Added OpenAPI validation middleware`);

  app.use(
    expressjwt({ secret: config.JWT_SECRET, algorithms: ["HS256"] }).unless({
      path: ["/auth/register", "/auth/login", "/docs/openapi"],
    }),
  );
  if (config.LOGGING && config.VERBOSE)
    console.log(`Added JWT validation middleware`);

  app.use("/", peerServer);
  if (config.LOGGING && config.VERBOSE)
    console.log(`Added Peer Server middleware`);
};

export default addMiddleware;

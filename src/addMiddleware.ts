import { json, type Express } from "express";
import cors from "cors";
import * as OpenAPIValidator from "express-openapi-validator";
import config from "./config";
import type { Server } from "node:http";
import createPeerServer from "./createPeerServer";
import { expressjwt } from "express-jwt";

const addMiddleware = (app: Express, server: Server) => {
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
    "/",
    expressjwt({ secret: config.JWT_SECRET || "", algorithms: ["HS256"] }),
    peerServer,
  );
  if (config.LOGGING && config.VERBOSE)
    console.log(`Added Peer Server middleware`);
};

export default addMiddleware;

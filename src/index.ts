import express, { type ErrorRequestHandler } from "express";
import config from "./config";
import processHandling from "./processHandling";
import addMiddleware from "./addMiddleware";
import path from "node:path";
import { ACCESS_TOKEN_TTL_SECONDS, login, registerUser } from "./auth";
import type { components } from "./types/openapi";
import { expressjwt } from "express-jwt";
import jwt from "jsonwebtoken";
import ErrorResponse from "./ErrorResponse";
import z from "zod";
import { deleteUser, getUserById } from "./db";

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

app.post("/auth/register", async (req, res, next) => {
  try {
    const { user, token } = await registerUser({
      email: req.body.email,
      password_hash: req.body.password,
    });

    const resBody: components["schemas"]["AuthResponse"] = {
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.created_at.toISOString(),
      },
      accessToken: token,
      tokenType: "Bearer",
      expiresIn: ACCESS_TOKEN_TTL_SECONDS,
    };

    res.status(201).json(resBody);
  } catch (e) {
    next(e);
  }
});

app.post("/auth/login", async (req, res, next) => {
  try {
    const { user, token } = await login({
      email: req.body.email,
      password_hash: req.body.password,
    });

    const resBody: components["schemas"]["AuthResponse"] = {
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.created_at.toISOString(),
      },
      accessToken: token,
      tokenType: "Bearer",
      expiresIn: ACCESS_TOKEN_TTL_SECONDS,
    };

    res.status(200).json(resBody);
  } catch (e) {
    next(e);
  }
});

app.get("/docs/openapi", (req, res) => {
  //TODO add response when no docs have been generated
  res.status(200).sendFile(path.join(process.cwd() + "/static/openapi.html"));
});

app.get("/users/me", async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    throw new Error("No JWT token");
  }

  const id = z.parse(
    z.string(),
    jwt.decode(token.split(" ")[1] as string, { json: true })?.sub,
  );

  const user = await getUserById(id);

  if (!user) throw new Error("No such error exists");

  const responseBody: components["schemas"]["User"] = {
    id: user.id,
    email: user.email,
    createdAt: user.created_at.toISOString(),
  };
  res.status(200).json(responseBody);
});

app.delete("/users/me", async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    throw new Error("No JWT token");
  }

  const id = z.parse(
    z.string(),
    jwt.decode(token.split(" ")[1] as string, { json: true })?.sub,
  );

  try {
    await deleteUser(id);
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ErrorResponse) {
    res.status(err.status || 500).json({
      type: err.type,
      title: err.title,
      status: err.status,
      detail: err.detail,
      code: err.code,
    });
    return;
  }

  res.status(err.status || 500).json({
    title: "Unexpected Server Error",
    status: 500,
    detail: err.message || undefined,
    code: "500",
  });
};
app.use(errorHandler);

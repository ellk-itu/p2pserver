import config from "@/config";
import { getUserByEmail, getUserById, insertUser } from "@/db";
import ErrorResponse from "@/ErrorResponse";
import generateDocUri from "@/generateDocUri";
import { user } from "@/schemas/db.schema";
import { components } from "@/schemas/openapi.schema";
import type { User } from "@/types/db";
import { randomUUIDv7, secrets } from "bun";
import createHttpError from "http-errors";
import * as jwt from "jsonwebtoken";
import z, { email } from "zod";

export const ACCESS_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7 * 26; // 6 months

const createToken = (id: string, secret: string) => {
  const accessToken = jwt.sign({ sub: id }, secret, {
    algorithm: "HS256",
    expiresIn: ACCESS_TOKEN_TTL_SECONDS,
  });

  return accessToken;
};

export const registerUser = async (userDetails: {
  email: User["email"];
  password_hash: User["password_hash"];
}) => {
  try {
    components.schemas.RegisterRequest.validate(userDetails);
  } catch (e) {
    throw new ErrorResponse({
      status: 400,
      title: "Request is malformed",
      type: generateDocUri("registeruser"),
      code: "400",
      detail: "Could not validate Input",
    });
  }

  const { email, password_hash } = userDetails;

  if (!config.JWT_SECRET) {
    throw new Error(
      "No JWT Secret key configured. Set the env variable JWT_SECRET",
    );
  }

  const currentUser: User | undefined = await getUserByEmail(email);

  if (currentUser) {
    throw new ErrorResponse({
      status: 409,
      title: "Email is in use",
      type: generateDocUri("registeruser"),
      code: "409",
    });
  }

  const newUser: User = user.parse({
    id: randomUUIDv7(),
    email,
    password_hash,
    created_at: new Date(Date.now()),
  });

  if (process.env.NODE_ENV !== "test") {
    await insertUser(newUser);
  }

  return { user: newUser, token: createToken(newUser.id, config.JWT_SECRET) };
};

export const login = async (userDetails: {
  id?: User["id"];
  email?: User["email"];
  password_hash: User["password_hash"];
}) => {
  const { id, email, password_hash } = userDetails;

  if (!config.JWT_SECRET) {
    throw new Error(
      "No JWT Secret key configured. Set the env variable JWT_SECRET",
    );
  }

  if (!id && !email) {
    throw new Error("One of id or email need to be specified");
  }

  let currentUser;

  if (id) {
    currentUser = await getUserById(id);
  } else if (email) {
    currentUser = await getUserByEmail(email);
  }

  if (!currentUser) {
    throw new Error("No user with specifications");
  }

  if (currentUser.password_hash !== password_hash) {
    throw new Error("Incorrect password");
  }

  return {
    user: currentUser,
    token: createToken(currentUser.id, config.JWT_SECRET),
  };
};

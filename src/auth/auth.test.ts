import { expect, test } from "bun:test";
import { login, registerUser } from ".";
import { hashSync } from "bcrypt";
import type { User } from "@/types/db";
import { user } from "@/schemas/db.schema";
import { randomUUIDv7 } from "bun";
import { deleteUser, insertUser } from "@/db";

test("Get Token From Registering A New User", async () => {
  expect(
    await registerUser({
      email: "test@email.com",
      password_hash: hashSync("supersecurepassword", 12),
    }),
  ).toBeString();
});

test("Get Token From Registered User", async () => {
  const exampleUser: User = user.parse({
    id: randomUUIDv7(),
    email: randomUUIDv7() + "@email.com",
    password_hash: hashSync("password", 12),
    created_at: new Date(Date.now()),
  });

  await insertUser(exampleUser);

  expect(
    await login({
      email: exampleUser.email,
      password_hash: exampleUser.password_hash,
    }),
  ).toBeString();

  await deleteUser(exampleUser.id);
});

import { user } from "@/schemas/db.schema";
import type { User } from "@/types/db";
import { hashSync } from "bcrypt";
import { randomUUIDv7 } from "bun";
import { expect, test } from "bun:test";
import { deleteUser, getUserByEmail, getUserById, insertUser } from ".";

test("Database wrapper functions", async () => {
  const exampleUser: User = user.parse({
    id: randomUUIDv7(),
    email: "test@email.com",
    password_hash: hashSync("password", 10),
    created_at: new Date(Date.now()),
  });

  await insertUser(exampleUser);

  expect((await getUserByEmail(exampleUser.email))?.id).toBe(exampleUser.id);

  expect((await getUserById(exampleUser.id))?.id).toBe(exampleUser.id);

  await deleteUser(exampleUser.id);
});

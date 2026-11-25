import type { User } from "@/types/db";
import { type Statement } from "better-sqlite3";
import { getStatement } from "./statements";

export const insertUser = async (user: User) => {
  (await getStatement("insertUser"))?.run(
    user.id,
    user.email,
    user.password_hash,
    user.created_at.toDateString(),
  );
};

export const getUserByEmail = async (
  email: string,
): Promise<User | undefined> => {
  const stmt = (await getStatement("getUser")) as Statement<
    [User["email"], User["id"]],
    User
  >;
  return stmt.get(email, "");
};

export const getUserById = async (id: string): Promise<User | undefined> => {
  const stmt = (await getStatement("getUser")) as Statement<
    [User["email"], User["id"]],
    User
  >;
  return stmt.get("", id);
};

export const deleteUser = async (id: string) => {
  const stmt = (await getStatement("deleteUser")) as Statement<[User["id"]]>;
  const result = stmt.run(id);

  if (result.changes <= 0) {
    throw new Error("User id doesn't exist");
  }

  return true;
};

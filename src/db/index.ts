import { hashSync } from "bcrypt";
import * as User from "./schemas/User";

const tempUsers: User.Type[] = [
  {
    email: "test@email.com",
    password: hashSync("password", 10),
    created_at: new Date(Date.now()),
  },
];

export const getUser = (email: string): User.Type | null => {
  return tempUsers.find((user) => user.email === email) || null;
};

export const userExists = (email: string) => {
  return tempUsers.findIndex((user) => user.email === email) || null;
};

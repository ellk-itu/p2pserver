import Database from "better-sqlite3";
import { getStatement } from "./statements";
import { readFileSync } from "fs";
import path from "path";

export const db = new Database("users.db");

db.prepare(
  readFileSync(path.join(__dirname + "/queries/init.sqlite")).toString(),
).run();

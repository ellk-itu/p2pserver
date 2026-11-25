import { readdir, readFile } from "fs/promises";
import path from "path";
import { db } from "./db";
import type { Statement } from "better-sqlite3";

const statements: Record<string, Statement> = {};

const queries = await readdir(path.join(__dirname + "/queries"));
const queriesLoaded = new Promise(async (resolve) => {
  await Object.assign(
    statements,
    Object.fromEntries(
      await Promise.all(
        queries.map(async (filename) => [
          filename.split(".")[0],
          db.prepare(
            (
              await readFile(path.join(__dirname + "/queries/" + filename))
            ).toString(),
          ),
        ]),
      ),
    ),
  );
  resolve(true);
});

export const getStatement = async (statement: string) => {
  await queriesLoaded;

  const stmt = statements[statement];

  if (!stmt) {
    throw new Error("No Such Statement Found");
  }

  return stmt;
};

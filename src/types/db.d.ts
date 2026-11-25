import type { user } from "@schemas/db.schema";
import type z from "zod";

export type User = z.infer<typeof user>;

import z from "zod";

export const user = z.object({
  id: z.uuid(),
  email: z.email(),
  password_hash: z.string(),
  created_at: z.coerce.date(),
});

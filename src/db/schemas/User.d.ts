import z from "zod";

const userSchema = z.object({
  email: z.string(),
  created_at: z.coerce.date(),
  password: z.string(),
});

export type Type = z.infer<typeof userSchema>;

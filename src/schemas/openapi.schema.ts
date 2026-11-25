import { z } from "zod";

export const components = {
  schemas: {
    RegisterRequest: z.object({
      /** Format: email */
      email: z.email(),
      /** Format: password */
      password: z.string().min(4),
    }),
    LoginRequest: z.object({
      /** Format: email */
      email: z.email(),
      /** Format: password */
      password: z.string().min(4),
    }),
    AuthResponse: z.object({
      user: z.object({
        id: z.uuidv7(),
        email: z.email(),
        createdAt: z.iso.date(),
      }),
      /** @description JWT access token */
      accessToken: z.string(),
      /** @constant */
      tokenType: "Bearer",
      /**
       * @description Token lifetime in seconds
       * @example 3600
       */
      expiresIn: z.number().positive(),
    }),
  },
};

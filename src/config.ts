import { config } from "dotenv";
import z from "zod";

config({ path: "./config.env" });

const envSchema = z.object({
  HOST: z.string().min(1),
  PORT: z.coerce.number().min(0),
  PEER_PATH: z.string(),
  SECURE: z.stringbool(),
  SSLCERT: z.string().optional(),
  SSLKEY: z.string().optional(),
  JWT_SECRET: z.string().optional(),
  LOGGING: z.stringbool(),
  VERBOSE: z.stringbool(),
});

type Config = z.infer<typeof envSchema>;

const defaultConfig: Config = {
  HOST: "localhost",
  PORT: 3000,
  PEER_PATH: "/",
  SECURE: false,
  LOGGING: true,
  VERBOSE: false,
};

const parsedEnv = envSchema.partial().parse(process.env);

export default Object.assign({} as Config, defaultConfig, parsedEnv);

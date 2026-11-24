import config from "@/config";
import * as jwt from "jsonwebtoken";

export const registerUser = (email: string, password: string) => {
  let jwtSecretKey = config.JWT_SECRET;
  let data = {
    time: Date(),
    userId: 12,
  };

  const token = jwt.sign(data, jwtSecretKey);
};

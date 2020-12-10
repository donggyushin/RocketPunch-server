import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

class JsonWebTokenUtil {
  static generateToken = (userId: string): string => {
    return jwt.sign(
      {
        userId,
      },
      process.env.JSON_WEB_TOKEN_KEY || ""
    );
  };
}

export default JsonWebTokenUtil;

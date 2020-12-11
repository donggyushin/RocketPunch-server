import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

class JsonWebTokenUtil {
  static decodeToken = async (token: string): Promise<string> => {
    const decoded = (await jwt.verify(
      token,
      process.env.JSON_WEB_TOKEN_KEY || ""
    )) as { userId: string };
    const userIdString = decoded.userId;
    return userIdString;
  };

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

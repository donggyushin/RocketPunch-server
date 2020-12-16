import { Request, Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";

import JsonWebTokenUtil from "../../utils/jsonwebtoken";
import UserModel from "../../models/UserModel";

const LoginUser = async (req: Request, res: Response) => {
  interface Body {
    id?: string;
    pw?: string;
  }
  const { id, pw } = req.body as Body;
  console.log("here");
  if (!id || !pw) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      ok: false,
      error: getReasonPhrase(StatusCodes.UNPROCESSABLE_ENTITY),
      message: "아이디와 비밀번호를 입력해주세요",
    });
  }

  try {
    const existingUsers = await UserModel.find({
      userId: id,
    });

    if (existingUsers.length === 0) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        ok: false,
        error: getReasonPhrase(StatusCodes.UNPROCESSABLE_ENTITY),
        message: "존재하지 않는 유저입니다",
      });
    }

    const user = existingUsers[0];

    if (user.userPw === pw) {
      // token 생성하고 token 과 함께 보낸다.

      const token = JsonWebTokenUtil.generateToken(user._id);

      return res.json({
        ok: true,
        token,
        user,
      });
    } else {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        ok: false,
        error: getReasonPhrase(StatusCodes.UNPROCESSABLE_ENTITY),
        message: "비밀번호가 틀립니다",
      });
    }
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      ok: false,
      error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
      message: err.message,
    });
  }
};

export default LoginUser;

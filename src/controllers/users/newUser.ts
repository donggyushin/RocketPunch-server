import { Request, Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";

import UserModel from "../../models/UserModel";

const NewUser = async (req: Request, res: Response) => {
  interface Body {
    id?: string;
    pw?: string;
    profile?: string;
  }
  const { id, pw, profile } = req.body as Body;

  if (!id || !pw || !profile) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      ok: false,
      error: getReasonPhrase(StatusCodes.UNPROCESSABLE_ENTITY),
      message: "아이디, 비밀번호, 프로필 이미지를 모두 입력해주세요",
    });
  }

  try {
    // 해당 id 를 가진 유저가 있는지 먼저 찾는다
    const existingUsers = await UserModel.find({
      userId: id,
    });

    if (existingUsers.length !== 0) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        ok: false,
        error: getReasonPhrase(StatusCodes.UNPROCESSABLE_ENTITY),
        message: "이미 존재하는 유저입니다. 다른 아이디를 사용해주세요",
      });
    }

    const newUser = new UserModel({
      userId: id,
      userPw: pw,
      profileImage: profile,
    });

    await newUser.save();

    return res.json({
      ok: true,
      user: newUser,
    });

    // 해당 id 를 가진 유저가 없다면, user를 새로 만들어주고 status 200
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      ok: false,
      error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
      message: err.message,
    });
  }
};

export default NewUser;

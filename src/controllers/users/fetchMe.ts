import { Request, Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";

import JsonWebTokenUtil from "../../utils/jsonwebtoken";
import UserModel from "../../models/UserModel";

const FetchMe = async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      ok: false,
      error: getReasonPhrase(StatusCodes.UNPROCESSABLE_ENTITY),
      message: "token 을 보내주세요",
    });
  }

  const convertedToken = authorization.split(" ")[1];
  try {
    const userId = await JsonWebTokenUtil.decodeToken(convertedToken);

    const user = await UserModel.findById(userId);
    return res.json({
      ok: true,
      user,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      ok: false,
      error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
      message: err.message,
    });
  }
};

export default FetchMe;

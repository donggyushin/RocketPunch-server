import { Request, Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";

import UserModel from "../../models/UserModel";

const FetchUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    return res.json({
      ok: true,
      users,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      ok: false,
      error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
      message: err.message,
    });
  }
};

export default FetchUsers;

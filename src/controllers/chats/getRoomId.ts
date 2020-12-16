import { Request, Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";

import ChatRoomModel from "../../models/ChatRoomModel";
import UserModel from "../../models/UserModel";
import compareTwoArray from "../../utils/compareTwoArrays";

const GetRoomId = async (
  req: Request,
  res: Response
): Promise<Response<any>> => {
  interface Query {
    userIdsString?: string;
  }

  const { userIdsString } = req.query as Query;

  console.log("userIdsString" + userIdsString);

  if (!userIdsString) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      ok: false,
      error: getReasonPhrase(StatusCodes.UNPROCESSABLE_ENTITY),
      message: "유저 id들을 보내주세요",
    });
  }

  const userIds = userIdsString.split(",");

  if (userIds.length < 2) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      ok: false,
      error: getReasonPhrase(StatusCodes.UNPROCESSABLE_ENTITY),
      message: "2개 이상의 유저 id들을 보내주세요",
    });
  }

  const sortedUserIds = userIds.sort();
  try {
    let chatRooms = await ChatRoomModel.find({});
    chatRooms = chatRooms.filter((chatRoom) => {
      let userIdsToCompare = chatRoom.users.map((user) => {
        return user.userId;
      });
      userIdsToCompare = userIdsToCompare.sort();

      if (compareTwoArray(userIdsToCompare, sortedUserIds)) {
        return true;
      } else {
        return false;
      }
    });

    if (chatRooms.length === 0) {
      // 새롭게 챗 룸을 만들어주고, 해당 챗 room 을 반환한다
      // 일단 필요한 유저들을 확보한다.
      const users = await UserModel.find({
        userId: {
          $in: sortedUserIds,
        },
      });

      if (users.length < 2) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
          ok: false,
          error: getReasonPhrase(StatusCodes.UNPROCESSABLE_ENTITY),
          message: "유저가 모자랍니다",
        });
      }

      const cursors = users.map((user) => {
        return {
          user,
          recentReadMessageId: 0,
        };
      });

      const newChatRoom = new ChatRoomModel({
        users,
        nessages: [],
        cursors,
      });

      await newChatRoom.save();
      return res.json({
        ok: true,
        chatRoomId: newChatRoom._id,
      });
    } else {
      const chatRoom = chatRooms[0];
      return res.json({
        ok: true,
        chatRoomId: chatRoom._id,
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

export default GetRoomId;

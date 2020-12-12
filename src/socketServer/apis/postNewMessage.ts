import { Request, Response } from "express";

import ChatRoomModel from "../../models/ChatRoomModel";
import { IChat } from "../chatSocket";
import JsonWebTokenUtil from "../../utils/jsonwebtoken";
import MessageModel from "../../models/MessageModel";
import UserModel from "../../models/UserModel";

const PostNewMessage = async (
  roomId: string,
  userToken: string,
  text: string,
  chats: IChat[]
) => {
  try {
    const userId = await JsonWebTokenUtil.decodeToken(userToken);
    const user = await UserModel.findById(userId);

    const newMessage = new MessageModel({
      messageId: new Date().getTime(),
      user,
      createdAt: new Date(),
      text,
    });

    // 해당 room 에 있는 모든 user 들에게 데이터를 보내준다.
    const theChats = chats.filter((chat) => chat.roomId === roomId);
    const theChat = theChats[0];
    theChat.sockets.map((socket) => {
      socket.emit("new_message", {
        ok: true,
        message: newMessage,
      });
    });

    const chatRoom = await ChatRoomModel.findById(roomId);

    if (!chatRoom) {
      return {
        ok: false,
        message: "존재하지 않는 채팅방입니다",
      };
    }

    await newMessage.save();

    const messages = chatRoom.messages;

    messages.push(newMessage);

    await chatRoom.updateOne({
      messages,
    });

    return {
      ok: true,
      message: newMessage,
    };
  } catch (err) {
    return {
      ok: false,
      message: err.message,
    };
  }
};

export default PostNewMessage;

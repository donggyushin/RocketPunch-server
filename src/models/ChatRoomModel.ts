import { IUser, IUserDocument } from "./UserModel";

import mongoose from "mongoose";

interface ICursorDocument extends mongoose.Document, ICursor {}

export interface ICursor {
  user: IUser;
  recentReadMessageId: number;
}

interface IMessageDocument extends mongoose.Document, IMessage {}

export interface IMessage {
  messageId: number;
  user: IUser;
  createdAt: Date;
  text: string;
}

interface IChatRoomDocument extends mongoose.Document, IChatRoom {}

export interface IChatRoom {
  users: IUserDocument[];
  messages: IMessageDocument[];
  cursors: ICursorDocument[];
  updatedAt: Date;
}

const chatRoomSchema = new mongoose.Schema({
  users: {
    type: [
      {
        userId: String,
        profileImage: String,
      },
    ],
  },
  messages: {
    type: [
      {
        messageId: Number,
        user: {
          userId: String,
          profileImage: String,
        },
        createdAt: {
          type: Date,
        },
        text: {
          type: String,
        },
      },
    ],
  },
  cursors: {
    type: [
      {
        user: {
          userId: String,
          profileImage: String,
        },
        recentReadMessageId: {
          type: Number,
        },
      },
    ],
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

const ChatRoomModel = mongoose.model<IChatRoomDocument>(
  "ChatRoom",
  chatRoomSchema
);

export default ChatRoomModel;

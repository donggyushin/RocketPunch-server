import { IUser } from "./UserModel";
import mongoose from "mongoose";

export interface ICursor extends mongoose.Document {
  user: IUser;
  recentReadMessageId: number;
}

export interface IMessage extends mongoose.Document {
  messageId: number;
  user: IUser;
  createdAt: Date;
}

export interface IChatRoom extends mongoose.Document {
  users: IUser[];
  messages: IMessage[];
  cursors: ICursor[];
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
});

const ChatRoomModel = mongoose.model<IChatRoom>("ChatRoom", chatRoomSchema);

export default ChatRoomModel;

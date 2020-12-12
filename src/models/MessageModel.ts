import { IUser } from "./UserModel";
import mongoose from "mongoose";

interface IMessageDocument extends mongoose.Document, IMessage {}

export interface IMessage {
  messageId: number;
  user: IUser;
  createdAt: Date;
  text: string;
}

const messageSchema = new mongoose.Schema({
  messageId: {
    type: Number,
  },
  user: {
    type: {
      userId: String,
      profileImage: String,
    },
  },
  createdAt: {
    type: Date,
  },
  text: {
    type: String,
  },
});

const MessageModel = mongoose.model<IMessageDocument>("Message", messageSchema);
export default MessageModel;

import mongoose from "mongoose";

export interface IUserDocument extends mongoose.Document, IUser {}

export interface IUser {
  userId: string;
  userPw: string;
  profileImage: string;
}

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
  },
  userPw: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    required: true,
  },
});

const UserModel = mongoose.model<IUserDocument>("User", userSchema);

export default UserModel;

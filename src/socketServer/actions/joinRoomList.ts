import { Socket } from "socket.io";

const JoinRoomList = (userId: string, socket: Socket) => {
  // @ts-ignore
  socket.userId = userId;
  return socket;
};

export default JoinRoomList;

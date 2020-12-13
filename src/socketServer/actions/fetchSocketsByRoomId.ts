import { IChat } from "../chatSocket";
import { Socket } from "socket.io";

const FetchSocketsByRoomId = (chats: IChat[], roomId: string): Socket[] => {
  const filteredChats = chats.filter((chat) => chat.roomId === roomId);
  let sockets: Socket[] = [];
  filteredChats.map((chat) => {
    sockets = sockets.concat(chat.sockets);
  });

  return sockets;
};

export default FetchSocketsByRoomId;

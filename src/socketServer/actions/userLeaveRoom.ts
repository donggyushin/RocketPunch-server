import { IChat } from "../chatSocket";
import { Socket } from "socket.io";

const UserLeaveRoom = (chats: IChat[], socket: Socket, sockets: Socket[]) => {
  // 기존에 존재하던 chat을 업데이트 시켜준다.
  const updatedChats = chats.map((chat) => {
    if (chat.sockets.includes(socket)) {
      const sockets = chat.sockets.filter(
        (socketInChat) => socketInChat !== socket
      );

      const updatedChat = {
        ...chat,
        sockets,
      };
      return updatedChat;
    } else {
      return chat;
    }
  });
  const filteredChats = updatedChats.filter(
    (chat) => chat.sockets.length !== 0
  );
  chats = filteredChats;
  const updatedSockets = sockets.filter(
    (socketInSockets) => socket !== socketInSockets
  );
  return { chats, sockets: updatedSockets };
};

export default UserLeaveRoom;

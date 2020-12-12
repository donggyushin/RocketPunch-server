import FetchMessages from "../apis/fetchMessages";
import { IChat } from "../chatSocket";
import { Socket } from "socket.io";

const UserJoinedRoom = (
  data: any,
  chats: IChat[],
  socket: Socket,
  sockets: Socket[]
) => {
  const { roomId, userId } = data;

  // @ts-ignore
  socket.userId = userId;
  sockets.push(socket);

  const existingChats = chats.filter((chat) => chat.roomId === roomId);
  if (existingChats.length === 0) {
    // 기존에 존재하지 않던 챗일 경우에 새로운 챗을 만들어주고 chats 에 넣어준다.
    const newChat = {
      roomId,
      sockets: [socket],
    };

    chats.push(newChat);
  } else {
    // 기존에 존재하던 챗이라면 기존의 챗에 userIds와 sockets 를 최신화 해준다

    const existingChat = existingChats[0];
    const updatedChat = {
      ...existingChat,
      sockets: [...existingChat.sockets, socket],
    };

    const updatedChats = chats.map((chat) => {
      if (chat.roomId === updatedChat.roomId) {
        return updatedChat;
      } else {
        return chat;
      }
    });
    chats = updatedChats;
  }

  // chats 를 업데이트 시켜주었으니까 이제 무얼 해야하지?
  // 딱히 할거 없나?
  // 여기서 메시지를 보내주자!

  FetchMessages(roomId).then((data) => {
    if (data.ok) {
      socket.emit("room_loaded", data);
    }
  });

  return {
    chats,
    sockets,
  };
};

export default UserJoinedRoom;

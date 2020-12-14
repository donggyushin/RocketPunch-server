import { IChat } from "../chatSocket";
import PostNewMessage from "../apis/postNewMessage";
import { Socket } from "socket.io";
import UpdateRoom from "./updateRoom";

const NewMessage = (
  data: any,
  chats: IChat[],
  sockets: Socket[],
  data2: any
) => {
  const { roomId, userToken, text } = data;
  PostNewMessage(roomId, userToken, text, chats).then((data) => {
    // 해당 room 에 있는 모든 user 들에게 데이터를 보내준다.

    UpdateRoom(data2, sockets);
  });
};

export default NewMessage;

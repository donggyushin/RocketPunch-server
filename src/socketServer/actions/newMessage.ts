import { IChat } from "../chatSocket";
import PostNewMessage from "../apis/postNewMessage";

const NewMessage = (data: any, chats: IChat[]) => {
  const { roomId, userToken, text } = data;
  PostNewMessage(roomId, userToken, text, chats).then((data) => {
    // 해당 room 에 있는 모든 user 들에게 데이터를 보내준다.
    console.log("메시지 전송 성공");
  });
};

export default NewMessage;

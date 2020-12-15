import FetchChatRoom from "../apis/fetchChatRoom";
import FetchSocketsByRoomId from "./fetchSocketsByRoomId";
import { IChat } from "../chatSocket";
import UpdateRoom from "./updateRoom";
import { Socket } from "socket.io";

const UserReadMessage = (
  roomId: string,
  userId: string,
  messageId: string,
  chats: IChat[],
  sockets: Socket[]
) => {
  FetchChatRoom(roomId).then(async (data) => {
    const { ok, chatRoom } = data;
    if (ok) {
      try {
        // 채팅방을 찾았다. 이제 뭐하지?
        // 뭐하긴, 커서를 가져와야지
        let cursors = chatRoom!.cursors;
        // 이제 이 커서를 업데이트 시켜주어야함.

        // 내가 원하는 채팅방을 찾자
        const chatsIWant = chats.filter((chat) => chat.roomId === roomId);
        const chatIwant = chatsIWant[0];

        if (chatIwant.sockets.length <= 1) {
          // 만약 채팅방에 나만 있다면,
          cursors = cursors.map((cursor) => {
            if (cursor.user.userId === userId) {
              let updatedCursor = cursor;
              updatedCursor.recentReadMessageId = parseInt(messageId);
              // updatedCursor.save();
              return updatedCursor;
            } else {
              return cursor;
            }
          });
        } else {
          // 만약 채팅방에 나와 상대방 둘다 있다면
          cursors = cursors.map((cursor) => {
            if (cursor.user.userId === userId) {
              let updatedCursor = cursor;
              updatedCursor.recentReadMessageId = parseInt(messageId);
              // updatedCursor.save();
              return updatedCursor;
            } else {
              let updatedCursor = cursor;
              updatedCursor.recentReadMessageId = parseInt(messageId);
              return updatedCursor;
            }
          });
        }

        await chatRoom!.updateOne({
          cursors,
        });

        UpdateRoom({ roomId }, sockets);

        // 업데이트 되어진 커서들을 구했기 때문에, 해당 roomId를 가지고 있는
        // chat안에 들어있는 모든 소켓들을 통해서 emit 해준다.
        const socketsToEmit = FetchSocketsByRoomId(chats, roomId);
        socketsToEmit.map((socket) => {
          socket.emit("cursor_updated", { ok: true, cursors });
        });
      } catch (err) {}

      // 커서들이 업데이트 되어졌다. 이거는 이제 chatRoom 데이터베이스를 업데이트 시켜준다.
      // try {
      //   await chatRoom!.updateOne({
      //     cursors,
      //   });
      //   console.log("업데이트 완료");
      // } catch (err) {
      //   console.log("업데이트 실패");
      // }
    }
  });
};

export default UserReadMessage;

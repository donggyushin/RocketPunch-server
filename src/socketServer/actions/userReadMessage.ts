import FetchChatRoom from "../apis/fetchChatRoom";
import FetchSocketsByRoomId from "./fetchSocketsByRoomId";
import { IChat } from "../chatSocket";

const UserReadMessage = (
  roomId: string,
  userId: string,
  messageId: string,
  chats: IChat[]
) => {
  FetchChatRoom(roomId).then(async (data) => {
    const { ok, chatRoom } = data;
    if (ok) {
      // 채팅방을 찾았다. 이제 뭐하지?
      // 뭐하긴, 커서를 가져와야지
      let cursors = chatRoom!.cursors;
      // 이제 이 커서를 업데이트 시켜주어야함.
      cursors = cursors.map((cursor) => {
        if (cursor.user.userId === userId) {
          let updatedCursor = cursor;
          updatedCursor.recentReadMessageId = parseInt(messageId);

          return updatedCursor;
        } else {
          return cursor;
        }
      });
      // 업데이트 되어진 커서들을 구했기 때문에, 해당 roomId를 가지고 있는
      // chat안에 들어있는 모든 소켓들을 통해서 emit 해준다.
      const socketsToEmit = FetchSocketsByRoomId(chats, roomId);
      socketsToEmit.map((socket) => {
        socket.emit("cursor_updated", { ok: true, cursors });
      });

      // 커서들이 업데이트 되어졌다. 이거는 이제 chatRoom 데이터베이스를 업데이트 시켜준다.
      try {
        await chatRoom!.updateOne({
          cursors,
        });
        console.log("업데이트 완료");
      } catch (err) {
        console.log("업데이트 실패");
      }
    }
  });
};

export default UserReadMessage;

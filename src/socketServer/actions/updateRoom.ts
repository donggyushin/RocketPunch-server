import FetchChatRooms from "../apis/fetchChatRooms";
import ReturnUserIdsByRoomId from "../apis/returnUserIdsByRoomId";
import { Socket } from "socket.io";

const UpdateRoom = (data: any, sockets: Socket[]) => {
  console.log("update room 호출");
  ReturnUserIdsByRoomId(data.roomId).then((data) => {
    if (data.userIds) {
      const userIds = data.userIds;
      // 해당 userId들과 매칭되는 모든 socket 들을 구한다.
      const socketsToEmitUpdateRoom = sockets.filter((socket) => {
        let result = false;
        userIds.map((userId) => {
          // @ts-ignore
          console.log(socket.userId);
          // @ts-ignore
          if (userId == socket.userId) {
            result = true;
          }
        });

        return result;
      });
      // 이제 socketsToEmitUpdateRoom 들한테 update rooms 이벤트를 emit 해주면 된다.

      socketsToEmitUpdateRoom.map((socketInChatRooms) => {
        // @ts-ignore
        let userId = socketInChatRooms.userId;

        FetchChatRooms(userId).then((data) => {
          socketInChatRooms.emit("room_list", data);
        });
      });
    }
  });
};

export default UpdateRoom;

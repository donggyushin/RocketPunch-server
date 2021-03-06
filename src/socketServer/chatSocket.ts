import FetchChatRooms from "./apis/fetchChatRooms";
import JoinRoomList from "./actions/joinRoomList";
import NewMessage from "./actions/newMessage";
import { Socket } from "socket.io";
import UserJoinedRoom from "./actions/userJoinedRoom";
import UserLeaveRoom from "./actions/userLeaveRoom";
import UserReadMessage from "./actions/userReadMessage";

const app = require("express")();
const server = require("http").createServer(app);
const options = {
  /* ... */
};
const io = require("socket.io")(server, options);

export interface IChat {
  roomId: string;
  sockets: Socket[];
}

let chats: IChat[] = [];
let sockets: Socket[] = [];

const roomList = io.of("/roomlist");

io.on("connection", (socket: Socket) => {
  // 클라이언트와 연결이 성공되었다는 메시지를 보내준다.
  socket.emit("connected", { ok: true });

  // 유저가 채팅방에 조인했다.
  socket.on("join", (data) => {
    const result = UserJoinedRoom(data, chats, socket, sockets);
    chats = result.chats;
    sockets = result.sockets;
  });

  socket.on("new_message", (data) => {
    NewMessage(data, chats, sockets, data);
  });

  socket.on("user_read_message", (data) => {
    // 필요한 값?
    const { roomId, userId, messageId } = data;
    UserReadMessage(roomId, userId, messageId, chats, sockets);
  });

  socket.on("disconnect", () => {
    const result = UserLeaveRoom(chats, socket, sockets);
    chats = result.chats;
    sockets = result.sockets;
  });
});

roomList.on("connection", (socket: Socket) => {
  socket.emit("connected", { ok: true });

  socket.on("join_room_list", (data) => {
    const { userId } = data;

    // @ts-ignore
    const newSocket = JoinRoomList(userId, socket);
    sockets.push(newSocket);

    // 해당 user가 속해져 있는 모든 채팅방 정보들을 뿌려준다.
    FetchChatRooms(userId).then((data) => {
      socket.emit("room_list", data);
    });
  });

  socket.on("disconnect", () => {
    const result = UserLeaveRoom(chats, socket, sockets);
    chats = result.chats;
    sockets = result.sockets;
  });
});

server.listen(9091);

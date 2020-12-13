import FetchChatRooms from "./apis/fetchChatRooms";
import JoinRoomList from "./actions/joinRoomList";
import NewMessage from "./actions/newMessage";
import { Socket } from "socket.io";
import UpdateRoom from "./actions/updateRoom";
import UserJoinedRoom from "./actions/userJoinedRoom";
import UserLeaveRoom from "./actions/userLeaveRoom";

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
  console.log("user connected");

  // 클라이언트와 연결이 성공되었다는 메시지를 보내준다.
  socket.emit("connected", { ok: true });

  // 유저가 채팅방에 조인했다.
  socket.on("join", (data) => {
    console.log("join");
    const result = UserJoinedRoom(data, chats, socket, sockets);
    chats = result.chats;
    sockets = result.sockets;
    console.log(result);
  });

  socket.on("new_message", (data) => {
    NewMessage(data, chats, sockets, data);
    // UpdateRoom(data, sockets);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    const result = UserLeaveRoom(chats, socket, sockets);
    chats = result.chats;
    sockets = result.sockets;
    console.log(result);
  });
});

roomList.on("connection", (socket: Socket) => {
  console.log("user connected with roomlist socket");
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
    console.log(sockets);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    const result = UserLeaveRoom(chats, socket, sockets);
    chats = result.chats;
    sockets = result.sockets;
    console.log(result);
  });
});

server.listen(9091);

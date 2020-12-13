import ChatRoomModel from "../../models/ChatRoomModel";

const FetchChatRoom = async (roomId: string) => {
  try {
    const chatRoom = await ChatRoomModel.findById(roomId);
    if (!chatRoom) {
      return {
        ok: false,
        message: "해당 roomId를 가진 채팅방이 없습니다.",
      };
    }
    return {
      ok: true,
      chatRoom,
    };
  } catch (err) {
    return {
      ok: false,
      message: err.message,
    };
  }
};

export default FetchChatRoom;

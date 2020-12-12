import ChatRoomModel from "../../models/ChatRoomModel";

const FetchMessages = async (roomId: string) => {
  try {
    const chat = await ChatRoomModel.findById(roomId);

    if (!chat) {
      return {
        ok: false,
        message: "존재하지 않는 채팅방입니다",
      };
    }

    const messages = chat.messages;
    return {
      ok: true,
      messages,
      users: chat.users,
      cursors: chat.cursors,
    };
  } catch (err) {
    return {
      ok: false,
      message: err.message,
    };
  }
};

export default FetchMessages;

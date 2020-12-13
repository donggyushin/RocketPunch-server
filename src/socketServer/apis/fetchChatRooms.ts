import ChatRoomModel from "../../models/ChatRoomModel";

const FetchChatRooms = async (userId: string) => {
  try {
    const chatRooms = await ChatRoomModel.find();
    const filteredChatRooms = chatRooms.filter((room) => {
      let result = false;
      room.users.map((user) => {
        if (user.userId === userId) {
          result = true;
        }
      });
      return result;
    });

    // 여기서 updatedAt 을 기준으로 재정렬하고 보내주자.
    filteredChatRooms.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return {
      ok: true,
      chats: filteredChatRooms,
    };
  } catch (err) {
    return {
      ok: false,
      message: err.message,
    };
  }
};

export default FetchChatRooms;

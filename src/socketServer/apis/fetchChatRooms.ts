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

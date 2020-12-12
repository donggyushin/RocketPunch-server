import ChatRoomModel from "../../models/ChatRoomModel";

const ReturnUserIdsByRoomId = async (roomId: string) => {
  try {
    const room = await ChatRoomModel.findById(roomId);
    if (!room) {
      return {
        ok: false,
        message: "존재하지 않는 채팅방",
      };
    }

    const userIds = room.users.map((user) => {
      return user.userId;
    });
    return {
      ok: true,
      userIds,
    };
  } catch (err) {
    return {
      ok: false,
      message: err.message,
    };
  }
};

export default ReturnUserIdsByRoomId;

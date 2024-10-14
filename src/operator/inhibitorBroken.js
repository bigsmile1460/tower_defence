import { setInhibitorStatus } from "../Storages/stage.storage.js";

export const inhibitorBroken = (socket, userId) => {
  // 억제기 상태 파괴로 변경
  setInhibitorStatus(userId, "broken");

  // 클라이언트로 전달
  socket.emit("event", { handlerId: 12, payload: { status: "broken" } });
};

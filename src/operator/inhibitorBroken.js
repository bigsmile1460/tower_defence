import {
  getInhibitorHpLimit,
  getinhibitorInterval,
  setInhibitorHp,
  setInhibitorStatus,
} from "../Storages/stage.storage.js";

// 억제기 파괴 / 재생성
export const inhibitorBroken = (socket, userId) => {
  // 억제기 상태 파괴로 변경
  setInhibitorStatus(userId, "broken");

  // 일정 시간 후 억제기 상태 normal로 회복
  const restorTime = getinhibitorInterval(userId);
  setTimeout(() => {
    setInhibitorStatus(userId, "normal");
    const inhibitorMaxHp = getInhibitorHpLimit(userId);
    setInhibitorHp(userId, inhibitorMaxHp);

    // 클라이언트로 바뀐 억제기 상태 전달
    socket.emit("event", { handlerId: 12, payload: { status: "normal" } });
  }, restorTime);

  // 클라이언트로 바뀐 억제기 상태 전달
  socket.emit("event", { handlerId: 12, payload: { status: "broken" } });
};

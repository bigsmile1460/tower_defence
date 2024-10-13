import { getTowerGoldCheck } from "../../operator/towerSellOperator.js";
import { deleteTower } from "../../Storages/tower.storage.js";

export const towerSell = (io, socket, payload, userId) => {
  try {
    // 골드 상승
    getTowerGoldCheck(userId, payload);

    // 타워 삭제
    deleteTower(userId, payload);
    socket.emit("event", { handlerId: 10, payload: payload });

    return { status: "success", Message: "타워 판매" };
  } catch (error) {
    console.log("타워 판매 처리 중 에러 발생", error);
    return { status: "fail", Message: "타워 판매" };
  }
};

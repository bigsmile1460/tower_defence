import { getTowerGoldCheck } from "../../operator/towerSellOperator.js";
import { deleteTower } from "../../Storages/tower.storage.js";

export const towerSell = (socket, payload, userId) => {
  try {
    // 골드 상승
    getTowerGoldCheck(userId, payload);

    // 타워 삭제
    deleteTower(userId, payload);
    socket.emit("event", { handlerId: 10, payload: payload });

    return { status: "success", Message: "타워 판매" };
  } catch (error) {
    console.log(error.message, error);
    return { status: "fail", Message: "타워 판매" };
  }
};

import {
  deleteServerTower,
  getTowerGoldCheck,
} from "../../operator/towerSellOperator.js";

export const towerSell = (socket, payload, userId) => {
  try {
    // 골드 상승
    getTowerGoldCheck(userId, payload);

    // 타워 삭제
    deleteServerTower(userId, payload, socket);

    return { status: "success", Message: "타워 판매" };
  } catch (error) {
    console.log(error.message, error);
    return { status: "fail", Message: "타워 판매" };
  }
};

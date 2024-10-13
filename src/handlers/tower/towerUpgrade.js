import {
  servertowerUpgrade,
  towerUpgradeGoldCheck,
} from "../../operator/towerUpgradeOperator.js";

// 타워 업그레이드
export const towerUpgrade = (io, socket, payload, userId) => {
  try {
    // 골드 체크 및 차감
    if (towerUpgradeGoldCheck(userId, payload)) {
      return { status: "fail", Message: "골드 부족" };
    }

    // 타워 업그레이드 및 프론트엔드로 전달
    servertowerUpgrade(userId, payload, socket);

    return { status: "success", Message: "타워 업그레이드 성공!" };
  } catch (error) {
    console.log(error.message, error);
    return { status: "fail", Message: "타워 업그레이드 실패!" };
  }
};

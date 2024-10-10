import towerUpgradeOperator from "../operator/towerUpgradeOperator.js";

// 타워 업그레이드
export const towerAttack = (io, socket, payload, userId) => {
  try {
    // 타워 업그레이드 검증 함수
    towerUpgradeOperator.towerUpgradeCheck(payload.tower, payload.gold, userId);
    console.log("타워 강화 처리 성공");

    return { status: "success", Message: "타워 공격 성공!" };
  } catch (error) {
    console.log("타워 공격 정보 처리 중 에러 발생", error);
  }
};

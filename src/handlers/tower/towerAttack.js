import towerAttackOperator from "../../operator/towerAttackOperator.js";

// 타워 공격
export const towerAttack = (io, socket, payload, userId) => {
  try {
    // 타워 공격 검증 함수
    towerAttackOperator.towerAttackCheck(payload, userId);

    return { status: "success", Message: "타워 공격" };
  } catch (error) {
    console.log("타워 공격 정보 처리 중 에러 발생", error);
    return { status: "fail", Message: "타워 공격" };
  }
};

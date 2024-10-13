import towerAttackOperator from "../../operator/towerAttackOperator.js";

// 타워 공격
export const towerAttack = (socket, payload, userId) => {
  try {
    // 타워 공격 검증 함수
    towerAttackOperator.towerAttackCheck(payload, userId);

    return { status: "success", Message: "타워 공격" };
  } catch (error) {
    console.log(error.message, error);
    return { status: "fail", Message: "타워 공격" };
  }
};

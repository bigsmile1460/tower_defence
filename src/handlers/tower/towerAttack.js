import towerAttackOperator from "../../operator/towerAttackOperator.js";

// 타워 공격
export const towerAttack = (socket, payload, userId) => {
  try {
    // 타워 공격 실행
    towerAttackOperator.towerAttackCheck(socket, payload, userId);

    return { status: "success", Message: "타워 공격" };
  } catch (error) {
    console.log(error.message, error);
    return { status: "fail", Message: "타워 공격" };
  }
};

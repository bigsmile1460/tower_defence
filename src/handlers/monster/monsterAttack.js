import { monsterAttackCheck } from "../../operator/monsterAttackOperator.js";

// 몬스터가 억제기 공격 검증
export const monsterAttack = (socket, payload, userId) => {
  try {
    // 몬트서가 억제기 공격 검증
    monsterAttackCheck(socket, payload, userId);

    return { status: "success", message: "몬스터 공격" };
  } catch (error) {
    console.log(error.message, error);
    return { status: "fail", message: "몬스터 공격" };
  }
};

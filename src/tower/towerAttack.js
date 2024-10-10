import { createStage } from "../models/model.js";
import towerAttackOperator from "../operator/towerAttackOperator.js";

// 타워 공격
export const towerAttack = (io, socket, payload, userId) => {
  try {
    // 타워 공격 검증 함수
    towerAttackOperator.towerAttackCheck(
      payload.tower,
      payload.monsters,
      payload.inhibitor,
      userId
    );
    console.log("타워 공격/힐 처리 성공");

    return { status: "success", Message: "타워 공격 성공!" };
  } catch (error) {
    console.log("타워 공격 정보 처리 중 에러 발생", error);
  }
};

////////////// 게임 시작 임시 함수
export const gameStart = (io, socket, payload, userId) => {
  try {
    createStage(userId, payload.gold, payload.inhibitor);

    return { status: "success", Message: "게임 시작 성공!" };
  } catch (error) {
    console.log("게임 시작 정보 처리 중 에러 발생", error);
  }
};
////////////// 게임 시작 임시 함수

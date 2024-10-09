import { createStage } from "../models/model.js";

// 타워 공격
export const towerAttack = (io, socket, payload) => {
  try {
    console.log("타워 공격/힐 처리 성공", payload);

    return { status: "success", Message: "타워 공격 성공!" };
  } catch (error) {
    console.log("타워 공격 정보 처리 중 에러 발생", error);
  }
};

////////////// 게임 시작 임시 함수
export const gameStart = (io, socket, payload) => {
  try {
    createStage("userId1", payload.gold, payload.base);

    return { status: "success", Message: "게임 시작 성공!" };
  } catch (error) {
    console.log("게임 시작 정보 처리 중 에러 발생", error);
  }
};
////////////// 게임 시작 임시 함수

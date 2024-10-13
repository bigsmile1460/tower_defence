import stageOperator from "../../operator/stageOperator.js";
import { clearStage } from "../../Storages/stage.storage.js";
import { createTowers } from "../../Storages/tower.storage.js";

let startGameTime = 0; // 시작 시간 검증용 변수

// 토큰 검증
export const stageStart = async (io, socket, payload, userId) => {
  try {
    startGameTime = payload.startTime;
    clearStage(userId);

    // 시작 시 스테이지(스토리지) 생성
    const [stage, highScore] = await stageOperator.stageStart(userId);

    // 시작 시 타워(스토리지) 생성
    createTowers(userId); // 최성원 추가

    socket.emit("event", {
      handlerId: 1,
      payload: {
        stage,
        highScore,
      },
    });

    return { status: "success" };
  } catch (err) {
    return { status: "fail", message: `스테이지 시작 중 에러 발생` };
  }
};

export const stageChange = async (io, socket, payload, userId) => {
  try {
    const elapsedTime = payload.elpsedTime;

    const userGold = payload.userGold;

    const stage = stageOperator.stageChange(
      startGameTime,
      elapsedTime,
      userGold,
      userId
    );

    socket.emit("event", {
      handlerId: 2,
      payload: {
        stage,
      },
    });

    return { status: "success" };
  } catch (err) {
    return { status: "fail", message: `스테이지 변경 중 에러 발생` };
  }
};

export const stageEnd = async (io, socket, payload, userId) => {
  try {
    stageOperator.stageEnd(userId, payload.score);

    return { status: "success" };
  } catch (err) {
    return { status: "fail", message: `스테이지 종료 중 에러 발생` };
  }
};

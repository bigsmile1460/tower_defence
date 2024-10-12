import stageOperator from "../../operator/stageOperator.js";

let startGameTime = 0; // 시작 시간 검증용 변수

// 토큰 검증
export const stageStart = async (io, socket, payload, userId) => {
  try {
    startGameTime = payload.startTime;
    stageOperator.clearStage(userId);
    // 시작시 스테이지 생성
    const [stage, highScore] = await stageOperator.stageStart(userId);

    return { status: "success", startStage: stage, highScore: highScore };
  } catch (err) {
    return { status: "fail", message: err };
  }
};

export const stageChange = async (io, socket, payload, userId) => {
  try {
    const elpsedTime = payload.elpsedTime;

    const stage = stageOperator.stageChange(startGameTime, elpsedTime, userId);

    return { status: "success", currentStage: stage };
  } catch (err) {
    return { status: "fail", message: err };
  }
};

export const stageEnd = async (io, socket, payload, userId) => {
  try {
    stageOperator.clearStage(userId);
    stageOperator.stageEnd(userId, payload.score);

    return { status: "success" };
  } catch (err) {
    return { status: "fail", message: err };
  }
};

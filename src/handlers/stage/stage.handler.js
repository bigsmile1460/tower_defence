import stageOperator from "../../operator/stageOperator.js";
import { stages } from "../../Storages/stage.storage.js";

let startGameTime = 0; // 시작 시간 검증용 변수

// 토큰 검증
export const stageStart = async (io, socket, payload, userId) => {
  try {
    startGameTime = payload.startGameTime;
    // 시작시 스테이지 생성
    const highScore = await stageOperator.stageStart(userId);

    console.log(stages);

    return { status: "success", startStage: stages, highScore: highScore };
  } catch (err) {
    return { status: fail, message: err };
  }
};

export const stageChange = async (io, socket, payload, userId) => {
  try {
    console.log(`스테이지 서버에서 변경됨`);
    const elpsedTime = payload.elpsedTime;

    stageOperator.stageChange(startGameTime, elpsedTime, userId);

    return { status: "success", currentStage: stages };
  } catch (err) {
    return { status: fail, message: err };
  }
};

export const stageEnd = async (io, socket, payload, userId) => {
  try {
    stageOperator.stageEnd(userId, payload.score);

    return { status: "success" };
  } catch (err) {
    return { status: fail, message: err };
  }
};

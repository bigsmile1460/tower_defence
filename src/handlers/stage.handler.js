import { prismaAsset } from "../lib/utils/prisma/index.js";
import { getAllStages, getNextStage } from "../Storages/stage.js";

let startGameTime = 0; // 시작 시간 검증용 변수

// 토큰 검증
export const gameStart = async (io, socket, payload, userId) => {
  console.log(`게임 시작!!`);
  const accesToken = payload.accesToken;

  if (!accesToken) {
    console.log(`게임 에러`);
  }
  startGameTime = payload.startTime;
  const initGameDB = await prismaAsset.initGame.findFirst({
    where: {
      id: 1,
    },
  });

  const stages = getAllStages();

  // initGameDB와 stages에 정보가 있는지 없는지 검증

  return { status: "success", initGameDB: initGameDB, stages: stages };
};

export const stageChange = async (io, socket, payload, userId) => {
  const currentStage = payload.currentStage;

  //서버 관련 유저 골드 증가 및 스코어 증가
  // 유저 관련 DB가 하나 필요하다고 생각함

  const nextStage = getNextStage(currentStage.id + 1);

  // 현재 스테이지를 제대로 넘어갈 수 있는지 검증 다음 스테이지 존재 유무
  // 다음 스테이지의 정보가 존재하는지 검증
  // 다음 스테이지 넘어가기 위한 시간차이 elpesedTime - startTime  <= 500

  return { status: "success", currentStage: JSON.stringify(nextStage) };
};

export const gameEnd = async (io, socket, payload, userId) => {
  const { serverHighScore } = await prismaAsset.initGame.findFirst({
    where: {
      id: 1,
    },
  });

  if (payload.HighScore > serverHighScore) {
    const newHighScore = await prismaAsset.initGame.update({
      where: {
        id: 1,
      },
      data: {
        serverHighScore: payload.HighScore,
      },
    });

    // 오퍼레이터로 처리를 합시다...
    // gameEnd.Operator.js
    // 스코어 갱신이 안됬을 경우에 대한 에러검증
    if (!newHighScore) {
      return { status: `fail`, error: `서버에서 에러 발생!` };
    }

    return {
      status: `success`,
      broadCast: `${userId}님께서 최대점수 ${payload.HighScore}를 달성하였습니다.`,
    };
  } else {
    return {
      status: `success`,
      Message: `점수 ${payload.HighScore}을 달성하셨습니다.`,
    };
  }
};

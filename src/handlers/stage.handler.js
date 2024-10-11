import { prismaAsset } from "../lib/utils/prisma/index.js";
import { getAllStages, getNextStage } from "../Storages/stage.js";

export const gameStart = async (io, socket, payload, userId) => {
  console.log(`게임 시작!!`);
  const initGameDB = await prismaAsset.initGame.findFirst({
    where: {
      id: 1,
    },
  });

  const stages = getAllStages();

  return { initGameDB: initGameDB, stages: stages };
};

export const stageChange = async (io, socket, payload, userId) => {
  const currentStage = payload.currentStage;

  //서버 관련 유저 골드 증가 및 스코어 증가
  // 유저 관련 DB가 하나 필요하다고 생각함

  const nextStage = getNextStage(currentStage.id + 1);

  return { currentStage: JSON.stringify(nextStage) };
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

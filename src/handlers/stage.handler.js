import { prismaAsset, prismaUser } from "../lib/utils/prisma/index.js";
import { getAllStages, getStages } from "../Storages/stage.js";

export const gameStart = async (io, socket, payload, userId) => {
  console.log(`게임 시작!!`);
  const initGameDB = await prismaAsset.initGame.findFirst({
    where: {
      id: 1,
    },
  });

  console.log(initGameDB);
  const stages = getAllStages();

  return { initGameDB: initGameDB, stages: stages };
};

export const stageChange = async (io, socket, payload, userId) => {
  const currentStage = payload.currentStage;

  const nextStage = getStages(currentStage.id + 1);

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

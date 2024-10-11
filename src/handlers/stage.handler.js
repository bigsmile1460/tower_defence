import { prismaAsset, prismaUser } from "../lib/utils/prisma/index.js";
import { getAllStages, getNextStage } from "../Storages/stage.js";
import stagesOperator from "../operator/stageOperator.js";
let startGameTime = 0; // 시작 시간 검증용 변수

// 토큰 검증
export const stageStart = async (io, socket, payload, userId) => {
  console.log(`게임 시작!!`);
  startGameTime = payload.startTime;
  const initGameDB = await prismaAsset.initGame.findFirst({
    where: {
      id: 1,
    },
  });

  const stages = getAllStages();

  return { status: "success", initGameDB: initGameDB, stages: stages };
};

export const stageChange = async (io, socket, payload, userId) => {
  const currentStage = payload.currentStage;
  const elpsedTime = payload.elpsedTime;

  const nextStage = getNextStage(currentStage.id + 1);

  stagesOperator.stageChange(
    startGameTime,
    elpsedTime,
    currentStage,
    nextStage
  );

  return { status: "success", currentStage: JSON.stringify(nextStage) };
};

export const stageEnd = async (io, socket, payload, userId) => {
  const { serverHighScore } = await prismaAsset.initGame.findFirst({
    where: {
      id: 1,
    },
  });

  const user = await prismaUser.user.findFirst({
    where: {
      userId: userId,
    },
  });

  stagesOperator.stageEnd(user, serverHighScore);

  if (payload.HighScore > user.highScore) {
    await prismaUser.user.update({});
  }
  if (payload.HighScore > serverHighScore) {
    const newHighScore = await prismaAsset.initGame.update({
      where: {
        id: 1,
      },
      data: {
        serverHighScore: payload.HighScore,
      },
    });

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

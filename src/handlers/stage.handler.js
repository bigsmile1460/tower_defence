import { prismaUsers } from "../../prisma/utils/index.js";

export const gameStart = async (userId, payload) => {
  console.log(`게임 시작!!`);
  const initStage = await prismaUsers.initStage.findFirst({
    where: {
      id: 0,
    },
  });

  return { initStage: initStage };
};

export const gameEnd = async (userId, payload) => {
  const oldHighScore = await prismaUsers.initStage.findFirst({
    where: {
      id: 0,
    },
    orderBy: {
      serverHighScore: "desc",
    },
  });

  if (payload.HighScore > oldHighScore) {

    const newHighScore = await prismaUsers.initStage.update({
      where: {
        id: oldHighScore.id
      },
      data: {
        serverHighScore: payload.HighScore,
      }
    })
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

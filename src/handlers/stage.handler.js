import { prismaAsset, prismaUser } from "../lib/utils/index.js";

export const gameStart = async (userId, payload) => {
  console.log(`게임 시작!!`);
  const initGameDB = await prismaAsset.initGame.findFirst({
    where: {
      id: 1,
    },
  });

  return { initGameDB: initGameDB };
};

export const gameEnd = async (userId, payload) => {
  const oldHighScore = await prismaAsset.initGame.findFirst({
    where: {
      id: 1,
    },
    select: {
      serverHighScore: true,
    }
  });

  if (payload.HighScore > oldHighScore) {

    const newHighScore = await prismaAsset.initGame.update({
      where: {
        id: 1,
      },
      data: {
        serverHighScore: payload.HighScore,
      }
    })

    if(!newHighScore) {
      return {status: `fail` , error: `서버에서 에러 발생!`};
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

import { prismaUser } from "../lib/utils/prisma/index.js";
import {
  createStage,
  getStage,
  getUserGold,
  nextStage,
  setUserGold,
} from "../Storages/stage.storage.js";

class stagesOperator {
  async stageStart(userId) {
    const users = await prismaUser.user.findMany({
      orderBy: {
        highScore: "desc",
      },
    });

    await createStage(userId);

    const stage = getStage(userId);

    return [stage, users[0].highScore];
  }

  stageChange(startGameTime, elpsedTime, userGold, userId) {
    const stage = getStage(userId);

    if (
      (elpsedTime - startGameTime) % 1500 <= -10 &&
      (elpsedTime - startGameTime) % 1500 >= 10
    ) {
      throw new Error(`스테이지 변경 시간 불일치`);
    }

    if (getUserGold(userId) != userGold) {
      throw new Error(`유저 골드 조작이 의심됨`);
    }

    setUserGold(userId, userGold);

    nextStage(userId);

    if (stage.inhibitorHp > stage.inhibitorHpLimit) {
      stage.inhibitorHp = stage.inhibitorHpLimit;
    }

    const newStage = getStage(userId);

    return newStage;
  }

  async stageEnd(userId, score) {
    const user = await prismaUser.user.findFirst({
      where: {
        email: userId,
      },
    });

    if (!user) {
      throw new Error(`유저가 존재하지 않습니다.`);
    }

    if (score > user.highScore) {
      await prismaUser.user.update({
        where: {
          id: user.id,
        },
        data: {
          highScore: score,
        },
      });
    }
  }
}

export default new stagesOperator();

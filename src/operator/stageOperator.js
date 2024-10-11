import { prismaAsset, prismaUser } from "../lib/utils/prisma/index.js";
import { stages } from "../Storages/stage.storage.js";

class stagesOperator {
  async createStage(userId) {
    const { startGold, monsterCountLimit, inhibitorHp, inhibitorHpLimit } =
      await prismaAsset.initGame.findFirst({
        where: {
          id: 1,
        },
      });

    stages.push({
      userId: userId,
      stageInfo: {
        stageId: 1,
        gold: startGold,
        score: 0,
        inhibitorHp: inhibitorHp,
        inhibitorHpLimit: inhibitorHpLimit,
        monsterCount: 0,
        monsterCountLimit: monsterCountLimit,
      },
    });
  }

  getStage(userId) {
    const stage = stages.find((stage) => {
      return stage.userId === userId;
    });

    return stage;
  }

  nextStage(userId) {
    const stage = this.getStage(userId);

    stage.stageId++;
    stage.gold += 1000;
    stage.inhibitorHp += 200;
  }

  async stageStart(userId) {
    const users = await prismaUser.user.findMany({
      where: {
        email: userId,
      },
      orderBy: {
        highScore: "desc",
      },
    });

    await this.createStage(userId);

    return users[0].highScore;
  }

  stageChange(startGameTime, elpsedTime, userId) {
    const stage = this.getStage(userId);

    if (
      (elpsedTime - startGameTime) % 500 <= -10 &&
      (elpsedTime - startGameTime) % 500 >= 10
    ) {
      throw new Error(`스테이지 변경 시간 불일치`);
    }

    this.nextStage(userId);

    if (stage.inhibitorHp > stage.inhibitorHpLimit) {
      stage.inhibitorHp = stage.inhibitorHpLimit;
    }
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
          email: user.userId,
        },
        data: {
          highScore: score,
        },
      });
    }
  }
}

export default new stagesOperator();

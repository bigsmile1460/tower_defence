import { prismaAsset } from "../lib/utils/prisma/index.js";

// 스테이지에 대한 휘발성 메모리 저장
export const stages = [];

export async function createStage(userId) {
    const { startGold, monsterCountLimit, inhibitorHp, inhibitorHpLimit } =
      await prismaAsset.initGame.findFirst({
        where: {
          id: 1,
        },
      });
    stages.push({
      userId: userId,
      stageInfo: {
        stageId: 1, // 스테이지 레벨
        gold: startGold, // 클리어시 획득 골드
        score: 0, // 현재 점수
        inhibitorHp: inhibitorHp, // 몬스터 갯수 제한
        inhibitorHpLimit: inhibitorHpLimit, // 억제기 Hp
        monsterCountLimit: monsterCountLimit, // 억제기 최대 HP 제한
      },
    });
  }
  
  export function getStage(userId) {
    const stage = stages.find((stage) => {
      return stage.userId === userId;
    });
    return stage;
  }

  export function nextStage(userId) {
    const stage = getStage(userId);

    stage.stageInfo.stageId++;
    stage.stageInfo.gold += 1000;
    stage.stageInfo.inhibitorHp += 200;
  }

  export function clearStage(userId) {
    const stageIndex = stages.indexOf((element) => {
      return element.userId === userId;
    });

    stages.splice(stageIndex, 1);
  }

  export function getUserGold(userId) {
    return getStage(userId).stageInfo.gold;
  }

  export function setUserGold(userId, gold) {
    getStage(userId).stageInfo.gold += gold;
  }

  export function getUserScore(userId) {
    return getStage(userId).stageInfo.score;
  }

  export function setUserScore(userId, score) {
    getStage(userId).stageInfo.score += score;
  }
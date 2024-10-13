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
      inhibitorHp: inhibitorHp, // 억제기 Hp
      inhibitorHpLimit: inhibitorHpLimit, // 억제기 최대 HP 제한
      isInhibitorExist: true, // 억제기 파괴 유무
      inhibitorInterval: 5000, // 억제기 재생 시간
      monsterCount: 0, // 몬스터 수
      monsterCountLimit: monsterCountLimit, // 몬스터 제한(제한 오버시 게임 종료)
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
  getStage(userId).stageInfo.gold = gold;
}

export function getUserScore(userId) {
  return getStage(userId).stageInfo.score;
}

export function setUserScore(userId, score) {
  getStage(userId).stageInfo.score += score;
}

export function setMonsterCount(userId, monsterCount) {
  getStage(userId).stageInfo.monsterCount = monsterCount;
}

export function getMonsterCount(userId, monsterCount) {
  return getStage(userId).stageInfo.monsterCount;
}

export function setInhibitorHp(userId, inhibitorHp) {
  getStage(userId).stageInfo.inhibitorHp = inhibitorHp;
}

export function getInhibitorHp(userId, inhibitorHp) {
  return getStage(userId).stageIndex.inhibitorHp;
}

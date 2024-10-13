import { prismaAsset } from "../lib/utils/prisma/index.js";

// 스테이지에 대한 휘발성 메모리 저장
export const stages = [];

export async function createStage(userId) {
  const {
    gold,
    towerAmountLimit,
    monsterCount,
    monsterCountLimit,
    inhibitorHp,
    inhibitorHpLimit,
    inhibitorInterval,
    inhibitorStatus,
    stageChangeInterval
  } = await prismaAsset.initGame.findFirst({
    where: {
      id: 1,
    },
  });
  stages.push({
    userId: userId,
    stageInfo: {
      stageId: 1, // 스테이지 레벨
      gold: gold, // 유저가 가진 골드
      score: 0, // 현재 점수
      towerAmountLimit: towerAmountLimit, // 타워 최대 개수
      inhibitorHp: inhibitorHp, // 억제기 Hp
      inhibitorHpLimit: inhibitorHpLimit, // 억제기 최대 HP 제한
      inhibitorStatus: inhibitorStatus, // 억제기 상태 ( normal , broken , replace)
      inhibitorInterval: inhibitorInterval, // 억제기 재생 시간
      monsterCount: monsterCount, // 몬스터 수
      monsterCountLimit: monsterCountLimit, // 몬스터 제한(제한 오버시 게임 종료)
      stageChangeInterval: stageChangeInterval,
    },
  });
}

export function getStage(userId) {
  const stage = stages.find((stage) => {
    return stage.userId === userId;
  });
  return stage;
}

export async function nextStage(userId) {
  const stage = getStage(userId);

  const {gold} = await prismaAsset.initGame.findFirst({
    where: {
      id: 1,
    }
  })

  stage.stageInfo.stageId++;
  stage.stageInfo.gold += gold;
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
  getStage(userId).stageInfo.score = score;
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
  return getStage(userId).stageInfo.inhibitorHp;
}

export function getInhibitorStatus(userId) {
  return getStage(userId).stageInfo.inhibitorStatus;
}

export function setInhibitorStatus(userId, status) {
  getStage(userId).stageInfo.inhibitorStatus = status;
}

export function towerAmountLimit(userId) {
  return getStage(userId).stageInfo.towerAmountLimit;
}

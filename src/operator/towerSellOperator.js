import { getTower } from "../Storages/tower.storage.js";

// 골드 업데이트
export const getTowerGoldCheck = (userId, id) => {
  // stageStorage에서 골드 가저오기
  const gold = 10000;
  if (!gold) {
    throw new Error(`플레이중이지 않은 userId 신청: ${userId}`);
  }

  // 타워 데이터 가져오기
  const sellTower = getTower(userId, id);
  if (!sellTower) {
    throw new Error(`존재 하지 않는 tower.id 신청: ${id}`);
  }

  // stageStorage에서 골드 더하기 setGold(userId, gold + sellTower.towerPrice)
};

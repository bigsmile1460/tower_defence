import {
  getStage,
  getUserGold,
  setUserGold,
} from "../Storages/stage.storage.js";
import { getTower } from "../Storages/tower.storage.js";

// 골드 업데이트
export const getTowerGoldCheck = (userId, id) => {
  // 골드 데이터 조회
  console.log(getStage(userId));
  const gold = getUserGold(userId);
  if (!gold) {
    throw new Error(`플레이중이지 않은 userId 신청: ${userId}`);
  }

  // 타워 데이터 가져오기
  const sellTower = getTower(userId, id);
  if (!sellTower) {
    throw new Error(`존재 하지 않는 tower.id 신청: ${id}`);
  }

  // 골드 가산
  setUserGold(userId, sellTower.towerPrice * sellTower.sellPrcieRate);
};

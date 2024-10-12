import { getTower, upgradeTower } from "../Storages/tower.storage.js";

// 골드 검사
export const towerUpgradeGoldCheck = (userId, id) => {
  // stageStorage에서 골드 가저오기
  const gold = 10000;
  if (!gold) {
    throw new Error(`플레이중이지 않은 userId 신청: ${userId}`);
  }

  // 업그레이드 할 타워 조회
  const servertower = getTower(userId, id);
  if (!servertower) {
    throw new Error(`존재 하지 않는 tower.id 신청: ${id}`);
  }

  // 골드 부족할 경우 return true
  if (gold < servertower.upgradePrice) {
    return true;
  }

  // stageStorage에서 골드 차감오기 setGold(userId, gold - servertower.towerPrice * serverTower.sellPriceRate)

  return false;
};

// 타워 강화
export const servertowerUpgrade = (userId, id, socket) => {
  const serverTower = upgradeTower(userId, id);
  if (!serverTower) {
    throw new Error(`존재 하지 않는 tower.id 신청: ${id}`);
  }

  // 프론트엔드로 타워 업그레이드 전달
  socket.emit("event", {
    handlerId: 8,
    payload: id,
  });
};

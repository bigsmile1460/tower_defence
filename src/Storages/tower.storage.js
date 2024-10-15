import { v4 as uuidv4 } from "uuid";
const towers = {};

// 특정 유저에 대한 타워 배열을 생성
export const createTowers = (userId) => {
  return (towers[userId] = []);
};

// 특정 유저의 전체 타워 조회
export const getTowers = (userId) => {
  return towers[userId];
};

// 특정 유저의 특정 타워 조회
export const getTower = (userId, id) => {
  const servertower = towers[userId].find((data) => data.id === id);
  return servertower;
};

// 타워 업그레이드
export const upgradeTower = (userId, id) => {
  let servertowers = towers[userId].find((data) => data.id === id);
  servertowers.attackPower += servertowers.upgradeAttackPower;
  servertowers.towerPrice += servertowers.upgradePrice;
  servertowers.upgradePrice += servertowers.upgradeAddPrice;
  return servertowers;
};

// 타워 추가
export const pushTower = (userId, towerData, timeStamp) => {
  const id = uuidv4();
  const tower = {
    id: id,
    attackPower: towerData.attackPower,
    attackSpeed: towerData.attackSpeed,
    attackType: towerData.attackType,
    towerPrice: towerData.towerPrice,
    sellPriceRate: towerData.sellPriceRate,
    upgradeAttackPower: towerData.upgradeAttackPower,
    upgradePrice: towerData.upgradePrice,
    upgradeAddPrice: towerData.upgradeAddPrice,
    lastAttack: timeStamp,
  };
  towers[userId].push(tower);

  return tower;
};

// 타워 제거
export const deleteTower = (userId, id) => {
  const towerIndex = towers[userId].findIndex((data) => data.id === id);

  return towers[userId].splice(towerIndex, 1);
};

// 타워 초기화
export const clearTower = (userId) => {
  delete towers[userId];
};

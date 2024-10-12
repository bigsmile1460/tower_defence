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
export const getTower = (userId, tower) => {
  const towers = towers[userId];
  return towers[userId].find((data) => data.id === tower.id);
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
    upgradeAttackPower: towerData.upgradeAttackPower,
    lastAttack: timeStamp,
  };
  towers[userId].push(tower);

  return tower;
};

// 타워 삭제
export const deleteTower = (userId, tower) => {
  const towerIndex = towers[userId].findIndex((data) => data.id === tower.id);
  return towers[userId].splice(towerIndex, 1);
};

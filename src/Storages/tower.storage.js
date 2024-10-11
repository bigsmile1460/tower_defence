const towers = {};

// 특정 유저에 대한 타워 배열을 생성
const createTowers = (userId) => {
  return (towers[userId] = []);
};

// 특정 유저의 전체 타워 조회
const getTowers = (userId) => {
  return towers[userId];
};

// 특정 유저의 특정 타워 조회
const getTower = (userId, tower) => {
  const towers = towers[userId];
  return towers[userId].find((data) => data.id === tower.id);
};

// 타워 추가
const pushTower = (userId, tower) => {
  return towers[userId].push(tower);
};

// 타워 삭제
const deleteTower = (userId, tower) => {
  const towerIndex = towers[userId].findIndex((data) => data.id === tower.id);
  return towers[userId].splice(towerIndex, 1);
};
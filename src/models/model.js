const stages = {};

export const createStage = (userId, gold, inhibitor) => {
  stages[userId] = {
    gold: gold,
    score: 0,
    towers: [],
    monsters: [],
    inhibitor: { hp: inhibitor.hp, maxHp: inhibitor.maxHp },
    interval: 1000,
  };

  console.log("기본 스테이지 정보 생성 성공: ", stages[userId]);
};

export const getTower = (userId, id) => {
  const towers = stages[userId].towers;
  const tower = towers.find((tower) => tower.id === id);
  return tower;
};

export const getMonsters = (userId) => {
  return stages[userId].monsters;
};

export const getGold = (userId) => {
  return stages[userId].gold;
};

export const getInhibitor = (userId) => {
  return stages[userId].inhibitor;
};

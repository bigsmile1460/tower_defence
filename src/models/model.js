const stages = {};

export const createStage = (userId, gold, base) => {
  stages[userId] = {
    gold: gold,
    score: 0,
    towers: [],
    monsters: [],
    base: { hp: base.hp, maxHp: base.maxHp },
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

// stage 데이터 임시 저장
let stages = [
  { id: 1, Score: 300, clearGold: 200 },
  { id: 2, Score: 1000, clearGold: 500 },
  { id: 3, Score: 2000, clearGold: 1000 },
  { id: 4, Score: 3000, clearGold: 1500 },
  { id: 5, Score: 4000, clearGold: 3000 },
  { id: 6, Score: 5000, clearGold: 5000 },
];

export const getStage = (id) => {
  const currentStage = stages.find((stage) => {
    return stage.id === id;
  });

  return currentStage;
};

export const getNextStage = (id) => {
  return stages[id - 1];
};

export const getAllStages = () => {
  return stages;
};

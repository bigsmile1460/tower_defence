// stage 데이터 임시 저장
let stages = [
  { id: 1, requireScore: 100, clearGold: 200 },
  { id: 2, requireScore: 1000, clearGold: 500 },
  { id: 3, requireScore: 2000, clearGold: 1000 },
  { id: 4, requireScore: 3000, clearGold: 1500 },
  { id: 5, requireScore: 4000, clearGold: 3000 },
  { id: 6, requireScore: 5000, clearGold: 5000 },
];

export const getStages = (id) => {
  return stages[id - 1];
};

export const getAllStages = () => {
  return stages;
};

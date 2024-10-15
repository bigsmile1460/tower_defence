import { spawnStart } from "../../operator/monsterOperator.js";

export const spawnNormal = async (socket, userId) => {
  try {
    //몬스터 스폰 시작
    spawnStart(socket, userId);
  } catch (error) {
    throw new Error(`몬스터 스폰 에러`);
  }
};

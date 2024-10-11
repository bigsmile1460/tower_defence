import { spwanMonster } from "../../operator/monsterOperator.js";

export const spawnNormal = async (io, socket, payload, userId) => {
  try {
    //몬스터 스폰
    spwanMonster(io, socket, payload, userId)

    return { status: "success", message:"몬스터 스폰"};
  } catch (e) {
    return { status: "fail", message:"몬스터 스폰" };
  }
};
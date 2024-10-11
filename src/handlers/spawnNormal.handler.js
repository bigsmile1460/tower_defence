import { addMonster } from "../Storages/monster.storage.js";
import { getMonster } from "../operator/monsterOperator.js";

export const spawnNormal = async (userId, payload) => {
  // console.log("--------------------------")
  // console.log("spawnNormal userId:", userId)
  // console.log("--------------------------")
  // console.log("spawnNormal payload:", payload.id)
  const { stage } = payload;

  const getMonsterInfo = await getMonster(1);
  console.log("getMonsterInfo:", getMonsterInfo);
  if (getMonsterInfo.length !== 1) {
    return { status: "fail", message: "" };
  }
  //몬스터 추가
  addMonster(userId, getMonsterInfo);

  return { status: "success", handler: 6 };
};

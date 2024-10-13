import { spwanStart, getMonsterInfo } from "../../operator/monsterOperator.js";

export const spawnNormal = async (io, socket, payload, userId) => {
  try {

    console.log("payload:", payload.stage)

    //몬스터 스폰 시작
    spwanStart(io, socket, payload, userId)

    return { status: "success", message:"몬스터 스폰"};
  } catch (e) {
    return { status: "fail", message:"몬스터 스폰" };
  }
};

//몬스터 생성 주기 제공
export const monsterCycle = async (io, socket, payload, userId) => {
  try{
    console.log("monsterCycle 호출:",payload.stage)
    const cycle = await getMonsterInfo(io, socket, payload, userId)
    console.log("monsterCycle:", cycle[0].cycle)
    return {status: "success", message: "몬스터 주기",cycle: cycle[0].cycle}
  }
  catch(e){
    return {status: "fail", message: "몬스터 주기"}
  }
}
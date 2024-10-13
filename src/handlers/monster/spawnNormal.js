import { spawnStart, getMonsterInfo } from "../../operator/monsterOperator.js";

export const spawnNormal = async (socket, payload, userId) => {
  try {

    console.log("userId:", userId)
    //몬스터 스폰 시작
    spawnStart(socket, payload, userId)

    return { status: "success", message:"몬스터 스폰"};
  } catch (error) {
    console.log(error.message, error);
    return { status: "fail", message:"몬스터 스폰" };
  }
};

//몬스터 생성 주기 제공
export const monsterCycle = async (socket, payload, userId) => {
  try{
    console.log("monsterCycle 호출:",payload.stage)
    const cycle = await getMonsterInfo(socket, payload, userId)
    console.log("monsterCycle:", cycle[0].cycle)
    return {status: "success", message: "몬스터 주기",cycle: cycle[0].cycle}
  }
  catch(error){
    console.log(error.message, error);
    return {status: "fail", message: "몬스터 주기"}
  }
}
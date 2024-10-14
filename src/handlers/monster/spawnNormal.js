import { spawnStart } from "../../operator/monsterOperator.js";

export const spawnNormal = async (socket, userId) => {    
    //몬스터 스폰 시작
    spawnStart(socket, userId);    
};

<<<<<<< Updated upstream
=======
//몬스터 생성 주기 제공
export const monsterCycle = async (socket, payload, userId) => {
  try {    
    const cycle = await getMonsterInfo(socket, payload, userId);
    
    return { status: "success", message: "몬스터 주기", cycle: cycle[0].cycle };
  } catch (error) {
    console.log(error.message, error);
    return { status: "fail", message: "몬스터 주기" };
  }
};
>>>>>>> Stashed changes

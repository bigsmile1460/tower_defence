import { spawnStart } from "../../operator/monsterOperator.js";

export const spawnNormal = async (socket, userId) => {
    console.log("userId:", userId);
      spawnStart(socket, userId);
    //몬스터 스폰 시작
};


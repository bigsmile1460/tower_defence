import { spawnStart } from "../../operator/monsterOperator.js";

export const spawnNormal = async (socket, userId) => {    
    //몬스터 스폰 시작
    spawnStart(socket, userId);    
};


import { prismaAsset } from "../lib/utils/prisma/index.js";
import { addMonster } from "../Storages/monster.storage.js";


//기능 구현 후 class로 변경 예정
//몬스터 정보 호출
export const getMonster = (stageNo) => {
  return prismaAsset.monster.findMany({
    where: { stage: +stageNo },
  });
};


//스테이지에 맞는 몬스터 정보 추출
export const getMonsterInfo = async (io, socket, payload, userId) => {
  
  const getMonsterInfo = await getMonster(payload.stage);
  
  return getMonsterInfo
}
//몬스터 생성
export const spwanMonster = async (io, socket, payload, userId) => {
  //필요 정보 : 유저 고유값(토큰이용), 스테이지 정보
  const currentStage = payload.stage;
  console.log("몬스터스폰 호출");
  //스테이지 정보에 따라 스폰 몬스터 결정
  const getMonsterInfo = await getMonster(currentStage);
  console.log("getMonsterInfo:",getMonsterInfo[0])
  
  //생성 주기마다 몬스터를 생성, 클라이언트에게 제공하는 부분, 구현중.
  
  //일정 주기마다 반복
  setInterval(() => {
    //몬스터 생성 - monster.storage부분에 객체 생성하고 객체값 받아와서 
    addMonster(userId, getMonsterInfo[0])
    //몬스터 정보 제공
  }, getMonsterInfo[0].cycle);
  //addMonster(payload.id, getMonsterInfo);

  return true;
};

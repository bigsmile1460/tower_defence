import { prismaAsset } from "../lib/utils/prisma/index.js";


//몬스터 정보 호출
export const getMonster = (stageNo) => {
  return prismaAsset.monster.findMany({
    where: { stage: +stageNo },
  });
};

//몬스터 생성
export const spwanMonster = (io, socket, payload, userId) => {
  //필요 정보 : 유저 고유값(토큰이용), 스테이지 정보
  const { stage } = payload;
  console.log("몬스터스폰 호출");
  //스테이지 정보에 따라 스폰 몬스터 결정
  const getMonsterInfo = getMonster(1);
  console.log("getMonsterInfo:", getMonsterInfo);

  if (getMonsterInfo.length !== 1) {
    throw new Error(`몬스터 정보 불일치`);
  }
  //몬스터 등록 - 주기마다
  addMonster(payload.id, getMonsterInfo);

  return 
};

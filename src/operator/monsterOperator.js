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

  return getMonsterInfo;
};


export const startInterval = () => {
  intervalId = setInterval(() => {
    elpsedTime = Date.now();
    console.log(
      `인터벌: ${interval}, nowStage: ${nowStage}, elpsedTime: ${
        elpsedTime - startTime
      }`
    );
    //몬스터 객체 생성
    addMonster(payload.id, getMonsterInfo[0])
    //다음 스테이지로 넘어가는 조건 : 시간 -> 클라이언트로부터 값이 전달되면
    //getStage로 스테이지 
    if (elpsedTime - startTime >= 10000) {
      nowStage++;
      startTime = Date.now();
      interval = interval - 100;
      clearInterval(intervalId); // 기존 인터벌 제거
      startInterval();
    }
    //억제기 파괴되었을 때 몬스터 스폰 2배
    if (inhibitor && spwanDobble) {
      console.log("억제기 파괴");
      interval = interval / 2;
      inhibitor = false; //억제기 상태변화
      spwanDobble = false;
      clearInterval(intervalId); // 기존 인터벌 제거
      startInterval();
    }
    //억제기 재생성 시 몬스터 스폰 정상화
    if (inhibitor && !spwanDobble) {
      console.log("억제기 복구");
      interval = interval * 2;
      inhibitor = false; //억제기 상태변화
      clearInterval(intervalId); // 기존 인터벌 제거
      startInterval();
    }
  }, interval);
}
//몬스터 생성
export const spwanMonster = async (io, socket, payload, userId) => {
  //필요 정보 : 유저 고유값(토큰이용), 스테이지 정보
  let nowStage = 1; //초기 스테이지
  //스테이지 정보에 따라 스폰 몬스터 결정
  const getMonsterInfo = await getMonster(nowStage);
  let interval = getMonsterInfo[0].cycle; // 몬스터 스폰 주기
  let intervalId; //몬스터 스폰
  let startTime = Date.now();
  let elpsedTime = Date.now();
  let inhibitor = false; //억제기 상태변화 시 true(억제기 부서질때 & 생성될때)
  let spwanDobble = false; //억제기 부서질때 true
  // console.log("getMonsterInfo:", getMonsterInfo[0]);
  //일정 주기마다 반복
  // setInterval(() => {
  //   //몬스터 생성 - monster.storage부분에 객체 생성하고 객체값 받아와서
  //   addMonster(userId, getMonsterInfo[0]);
  //   //몬스터 정보 제공
  // }, getMonsterInfo[0].cycle);
  //addMonster(payload.id, getMonsterInfo);
  
  //몬스터 스폰 시작
 export const startInterval = () => {
    intervalId = setInterval(() => {
      elpsedTime = Date.now();
      console.log(
        `인터벌: ${interval}, nowStage: ${nowStage}, elpsedTime: ${
          elpsedTime - startTime
        }`
      );
      //몬스터 객체 생성
      addMonster(payload.id, getMonsterInfo[0])
      //다음 스테이지로 넘어가는 조건 : 시간 -> 클라이언트로부터 값이 전달되면
      //getStage로 스테이지 
      if (elpsedTime - startTime >= 10000) {
        nowStage++;
        startTime = Date.now();
        interval = interval - 100;
        clearInterval(intervalId); // 기존 인터벌 제거
        startInterval();
      }
      //억제기 파괴되었을 때 몬스터 스폰 2배
      if (inhibitor && spwanDobble) {
        console.log("억제기 파괴");
        interval = interval / 2;
        inhibitor = false; //억제기 상태변화
        spwanDobble = false;
        clearInterval(intervalId); // 기존 인터벌 제거
        startInterval();
      }
      //억제기 재생성 시 몬스터 스폰 정상화
      if (inhibitor && !spwanDobble) {
        console.log("억제기 복구");
        interval = interval * 2;
        inhibitor = false; //억제기 상태변화
        clearInterval(intervalId); // 기존 인터벌 제거
        startInterval();
      }
    }, interval);
  }

  startInterval();

  //10초마다 스테이지 변경 시
  // setTimeout(() => {
  //   nowStage++;
  //   interval = 500;
  //   clearInterval(intervalId); // 기존 인터벌 제거
  //   startInterval();
  // }, 10000);

  //억제기 파괴 spwanDobble = true, inhibitor = true
  // setTimeout(() => {
  //   spwanDobble = true;
  //   inhibitor = true;
  // }, 3000);

  //억제기 복구 inhibitor = true
  // setTimeout(() => {
  //   inhibitor = true;
  // }, 7000);

  return true;
};

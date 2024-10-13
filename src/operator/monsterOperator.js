import { prismaAsset } from "../lib/utils/prisma/index.js";
import { addMonster } from "../Storages/monster.storage.js";
import {
  getStage,
  getInhibitorStatus,
  setInhibitorStatus,
} from "../Storages/stage.storage.js";
//기능 구현 후 class로 변경 예정
//몬스터 정보 호출
export const getMonster = (stageNo) => {
  return prismaAsset.monster.findMany({
    where: { stage: +stageNo },
  });
};

//스테이지에 맞는 몬스터 정보 추출
export const getMonsterInfo = async (stage) => {
  return await getMonster(stage);
};

//몬스터 생성
export const spwanStart = async (io, socket, payload, userId) => {
  //필요 정보 : 유저 고유값(토큰이용), 스테이지 정보
  let nowStage = getStage(); //초기 스테이지
  //스테이지 정보에 따라 스폰 몬스터 결정
  const getMonsterInfo = await getMonster(nowStage);
  let interval = getMonsterInfo[0].cycle; // 몬스터 스폰 주기
  let intervalId; //몬스터 스폰
  let spwanDobble = false; //억제기 부서질때 true

  //몬스터 스폰 시작
  function startInterval() {
    intervalId = setInterval(() => {

      //몬스터 객체 생성
      addMonster(payload.id, getMonsterInfo[0]);
      //다음 스테이지로 넘어감 - getStage로 스테이지 정보와 현재 스폰되는 스테이지 비교
      if (nowStage !== getStage()) {
        nowStage = getStage(); //현재 스테이지 조회
        clearInterval(intervalId); // 몬스터 스폰 중지
        startInterval(); //몬스터 스폰 시작(재귀)
      }
      //억제기 파괴되었을 때 몬스터 스폰 2배
      if (getInhibitorStatus() === "broken") { // Inhibitor ==="파괴"
        console.log("억제기 파괴");
        interval = interval / 2; //스폰 2배로 변경
        setInhibitorStatus("normal"); //억제기 상태변화 -> "Normal"
        spwanDobble = false;
        clearInterval(intervalId); // 몬스터 스폰 중지
        startInterval(); //몬스터 스폰 시작(재귀)
      }
      //억제기 재생성 시 몬스터 스폰 정상화
      if (getInhibitorStatus() === "replace") { //재생성
        console.log("억제기 복구");
        interval = interval * 2; //스폰 1배로 변경
        setIsInhibitorStatus("normal") //억제기 상태변화
        clearInterval(intervalId); // 몬스터 스폰 중지
        startInterval(); //몬스터 스폰 시작(재귀)
      }
    }, interval);
  }

  startInterval();

  return true;
};

export const spwanEnd = () => {
  clearInterval(intervalId); // 몬스터 스폰 중지
};

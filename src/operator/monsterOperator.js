import { prismaAsset } from "../lib/utils/prisma/index.js";
import { addMonster, getMonsterLength } from "../Storages/monster.storage.js";
import {
  getStage,
  getInhibitorStatus,
  setInhibitorStatus,
} from "../Storages/stage.storage.js";
import stageOperator from "./stageOperator.js";

//기능 구현 후 class로 변경 예정

export let intervalId; //몬스터 스폰

//몬스터 정보 호출
export const getMonster = (stageId) => {
  return prismaAsset.monster.findMany({
    where: { stage: +stageId },
  });
};

//몬스터 생성
export const spawnStart = async (socket, userId) => {
  //필요 정보 : 유저 고유값(토큰이용), 스테이지 정보
  const stageInfo = getStage(userId).stageInfo;

  let nowStage = getStage(userId).stageInfo.stageId; //초기 스테이지
  //스테이지 정보에 따라 스폰 몬스터 결정
  let getMonsterInfo = await getMonster(nowStage);
  let interval = getMonsterInfo[0].cycle; // 몬스터 스폰 주기
  // ------------------------ 최성원 수정 ---------------------------- //
  let intervalStatus = "normal"; // 몬스터 스폰에 적용된 interval 상태
  // ------------------------ 최성원 수정 ---------------------------- //
  // let intervalId; //몬스터 스폰

  //몬스터 스폰 시작
  function startInterval() {
    intervalId = setInterval(async () => {
      //서버에 몬스터 객체 생성
      const monsterData = addMonster(userId, getMonsterInfo[0]);

      //클라이언트에 스테이지 종료 전달
      if (stageInfo.monsterCountLimit <= getMonsterLength(userId)) {
        stageOperator.stageEnd(socket, userId);
      }
      //클라이언트에 몬스터 객체 전달
      else {
        socket.emit("event", { handlerId: 6, payload: { monsterData } });
      }
      //다음 스테이지로 넘어감 - getStage로 스테이지 정보와 현재 스폰되는 스테이지 비교
      if (nowStage !== getStage(userId).stageInfo.stageId) {
        nowStage = getStage(userId).stageInfo.stageId; //현재 스테이지 조회
        getMonsterInfo = await getMonster(nowStage);
        if (getMonsterInfo.length !== 0) {
          clearInterval(intervalId); // 몬스터 스폰 중지
          startInterval(); //몬스터 스폰 시작(재귀)
        } else {
          //스테이지 클리어
          clearInterval(intervalId); // 몬스터 스폰 중지
          socket.emit("event", {
            handlerId: 3,
            payload: "축하드립니다. 게임을 클리어하셨습니다.",
          });
        }
      }
      //억제기 파괴되었을 때 몬스터 스폰 2배
      if (getInhibitorStatus(userId) === "broken") {
        // Inhibitor ==="파괴"
        // ------------------------ 최성원 수정 ---------------------------- //
        // console.log("억제기 파괴");
        // interval = interval / 2; //스폰 2배로 변경
        // setInhibitorStatus(userId, "normal"); //억제기 상태변화 -> "normal"
        if (intervalStatus !== "broken") {
          interval /= 2;
          intervalStatus = "broken";
        }
        // ------------------------ 최성원 수정 ---------------------------- //
        clearInterval(intervalId); // 몬스터 스폰 중지
        startInterval(); //몬스터 스폰 시작(재귀)
      }
      //억제기 재생성 시 몬스터 스폰 정상화
      if (getInhibitorStatus(userId) === "noraml") {
        //재생성
        // ------------------------ 최성원 수정 ---------------------------- //
        // console.log("억제기 복구");
        // interval = interval * 2; //스폰 1배로 변경
        // setInhibitorStatus(userId, "normal"); //억제기 상태변화
        if (intervalStatus !== "normal") {
          interval *= 2;
          intervalStatus = "normal";
        }
        // ------------------------ 최성원 수정 ---------------------------- //
        clearInterval(intervalId); // 몬스터 스폰 중지
        startInterval(); //몬스터 스폰 시작(재귀)
      }
    }, interval);
  }

  startInterval();

  return true;
};

export const spawnEnd = (intervalId) => {
  clearInterval(intervalId); // 몬스터 스폰 중지
};

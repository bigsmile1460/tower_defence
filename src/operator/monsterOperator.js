import { prismaAsset } from "../lib/utils/prisma/index.js";
import { addMonster, getMonsterLength } from "../Storages/monster.storage.js";
import {
  getStage,
  getInhibitorStatus,
  setInhibitorStatus,
} from "../Storages/stage.storage.js";
import stageOperator from "./stageOperator.js";

export let intervalId = []; //몬스터 스폰
export let isStageClear = []; // 스테이지 클리어 조건 확인

//몬스터 정보 호출
export const getMonster = (stageId) => {
  return prismaAsset.monster.findFirst({
    where: { stage: +stageId },
  });
};

//몬스터 생성
export const spawnStart = async (socket, userId) => {
  try {
    //필요 정보 : 유저 고유값(토큰이용), 스테이지 정보
    const stageInfo = getStage(userId).stageInfo;
    const gameEnd = stageInfo.monsterCountLimit; //게임 종료 조건
    let nowStage = stageInfo.stageId; //초기 스테이지
    let getMonsterInfo = await getMonster(nowStage); //현재 스테이지에 알맞는 스폰 몬스터
    let interval = getMonsterInfo.cycle; // 몬스터 스폰 주기
    let intervalStatus = "normal"; // 억제기 상태 확인 값
    console.log(getMonsterInfo);

    const startInterval = () => {
      intervalId[userId] = setInterval(async () => {
        //서버에 몬스터 객체 생성
        const monsterData = addMonster(userId, getMonsterInfo);
        //서버 스테이지에 스테이지 종료 전달
        if (gameEnd <= getMonsterLength(userId)) {
          isStageClear[userId] = false;
          stageOperator.stageEnd(socket, userId);
        }
        //클라이언트에 몬스터 객체 전달
        else {
          socket.emit("event", { handlerId: 6, payload: { monsterData } });
        }

        //다음 스테이지로 넘어감 - getStage로 스테이지 정보와 현재 스폰되는 스테이지 비교
        const stageCompare = getStage(userId).stageInfo.stageId; //현재 스테이지 조회
        if (nowStage !== stageCompare) {
          //스테이지가 변경 되었는지 확인
          nowStage = stageCompare; //변경된 스테이지로 현재 스테이지 정보 변경
          getMonsterInfo = await getMonster(nowStage); //스테이지가 변경되면 몬스터 정보 재할당
          console.log(getMonsterInfo);

          if (getMonsterInfo) {
            //스테이지에 해당되는 몬스터가 존재하는지 확인
            if (intervalStatus === "broken") {
              interval = getMonsterInfo.cycle / 2; //몬스터 스폰 주기 재설정 - 억제기가 부서졌을 때
            } else {
              interval = getMonsterInfo.cycle; //몬스터 스폰 주기 재설정 - 억제기가 존재할 때
            }

            clearInterval(intervalId[userId]); // 몬스터 스폰 중지
            startInterval(); //몬스터 스폰 시작(재귀)
          } else {
            if (getMonsterLength === 0) {
              //스테이지 클리어
              isStageClear[userId] = true;
              clearInterval(intervalId[userId]); // 몬스터 스폰 중지
              stageOperator.stageEnd(socket, userId);
            }
          }
        }
        //억제기 파괴되었을 때 몬스터 스폰 2배
        if (
          getInhibitorStatus(userId) === "broken" &&
          intervalStatus !== "broken"
        ) {
          interval /= 2; //스폰 값 2배로 변경
          intervalStatus = "broken"; //억제기 상태를 "broken"으로 변경
          clearInterval(intervalId[userId]); // 몬스터 스폰 중지
          startInterval(); //몬스터 스폰 시작(재귀)
        }
        //억제기 재생성 시 몬스터 스폰 정상화
        if (
          getInhibitorStatus(userId) === "noraml" &&
          intervalStatus !== "normal"
        ) {
          interval *= 2; //스폰 값 1배로 변경
          intervalStatus = "normal"; //억제기 상태를 "normal"로 변경
          clearInterval(intervalId[userId]); // 몬스터 스폰 중지
          startInterval(); //몬스터 스폰 시작(재귀)
        }
      }, interval);
    };

    startInterval();
  } catch (error) {
    clearInterval(intervalId[userId]);
    throw new Error(error);
  }
};

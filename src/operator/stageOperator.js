import { prismaUser } from "../lib/utils/prisma/index.js";
import {
  createStage,
  getStage,
  getUserScore,
  nextStage,
} from "../Storages/stage.storage.js";
import { intervalId, isStageClear } from "./monsterOperator.js";

export let stageChangeInterval = [];

class stagesOperator {
  // 스테이지 시작
  async stageStart(socket,userId) {
    const users = await prismaUser.user.findMany({
      orderBy: {
        highScore: "desc",
      },
    });

    const highScore = users[0].highScore;

    await createStage(userId);

    const stage = getStage(userId);

    // 클라이언트로 게임 시작 정보 전달
    socket.emit("event", {
      handlerId: 1,
      payload: {
        stage,
        highScore,
      },
    });
  }

  // 스테이지 변경 정보 조회
  async stageChangeData(socket, userId) {
    // 스테이지 변경 쿨 타임 조회
    const stageChangeTime = getStage(userId).stageInfo.stageChangeInterval;
    if (!stageChangeTime) {
      throw new Error(`스테이지 변경 시간이 존재하지 않습니다.`);
    }

    // 쿨 타임마다 스테이지 변경 함수 실행
    stageChangeInterval[userId] = setInterval(() => {
      this.stageChange(socket, userId);
    }, stageChangeTime);
  }

  // 스테이지 변경
  async stageChange(socket, userId) {
    // 스테이지 변경
    await nextStage(userId);

    // 변경된 정보 전달
    const stageInfo = getStage(userId);
    socket.emit("event", { handlerId: 2, payload: { stageInfo: stageInfo } });
  }

  // 스테이지 종료
  async stageEnd(socket, userId) {
    clearInterval(intervalId[userId]);
    clearInterval(stageChangeInterval[userId]);

    // 유저 정보 조회
    const user = await prismaUser.user.findFirst({
      where: {
        email: userId,
      },
    });
    if (!user) {
      throw new Error(`유저가 존재하지 않습니다.`);
    }

    // 유저의 이번 게임 점수 조회
    const score = getUserScore(userId);

    // 점수 비교 및 저장
    if (score > user.highScore) {
      await prismaUser.user.update({
        where: {
          id: user.id,
        },
        data: {
          highScore: score,
        },
      });
    }

    if (isStageClear[userId]) {
      socket.emit("event", {
        handlerId: 3,
        payload: { clear: `clear` },
      });
    } else {
      socket.emit("event", { handlerId: 3, payload: { clear: `end` } });
    }

    // 클라이언트에 게임 종료 알림
  }
}

export default new stagesOperator();

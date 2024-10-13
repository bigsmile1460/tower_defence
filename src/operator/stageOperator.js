import { prismaUser } from "../lib/utils/prisma/index.js";
import {
  createStage,
  getStage,
  getUserScore,
  nextStage,
} from "../Storages/stage.storage.js";

class stagesOperator {
  // 스테이지 시작
  async stageStart(userId) {
    const users = await prismaUser.user.findMany({
      orderBy: {
        highScore: "desc",
      },
    });

    await createStage(userId);

    const stage = getStage(userId);

    return [stage, users[0].highScore];
  }

  // 스테이지 변경 정보 조회
  async stageChangeData(socket, userId) {
    // 스테이지 변경 쿨 타임 조회
    const stageChangeTime = getStage(userId).stageInfo.stageChangeInterval;
    if (!stageChangeTime) {
      throw new Error(`스테이지 변경 시간이 존재하지 않습니다.`);
    }

    // 쿨 타임마다 스테이지 변경 함수 실행
    const stageChangeInterval = setInterval(() => {
      this.stageChange(socket, userId);
    }, stageChangeTime);
  }

  // 스테이지 변경
  async stageChange(socket, userId) {
    console.log(`스테이지 변경 체크`);
    // 스테이지 변경
    await nextStage(userId);

    // 변경된 정보 전달
    const stageInfo = getStage(userId);
    socket.emit("event", { handlerId: 2, payload: { stageInfo: stageInfo } });
  }

  // 스테이지 종료
  async stageEnd(userId) {
    clearInterval(stageChangeInterval);
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

    // 클라이언트에 게임 종료 알림
    socket.emit("event", { handlerId: 3 });
  }
}

export default new stagesOperator();

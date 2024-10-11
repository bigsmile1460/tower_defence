import { getStage } from "../Storages/stage.js";

class stagesOperator {
  stageChange(startGameTime, elpsedTime, currentStage, nextStage) {
    const elpsedStage = getStage(currentStage.id);

    if (
      (elpsedTime - startGameTime) % 500 <= -5 &&
      (elpsedTime - startGameTime) % 500 >= 5
    ) {
      throw new Error(`스테이지 변경 시간 불일치`);
    }

    if (elpsedStage.id != currentStage.id) {
      throw new Error(`현재 스테이지 불일치`);
    }
    if (!nextStage) {
      throw new Error(`다음 스테이지 존재하지 않음`);
    }
  }

  stageEnd(user, serverHighScore) {
    // 현재 유저가 DB에 존재하는지
    console.log(`user`, user);
    if (!user) {
      throw new Error(`현재 유저가 존재하지 않음.`);
    } else if (!serverHighScore) {
      throw new Error(`현재 서버 최고 스코어가 존재하지 않음.`);
    }
  }
}

export default new stagesOperator();

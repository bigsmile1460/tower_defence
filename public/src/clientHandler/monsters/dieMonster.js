import GameClient from "../../Client/gameClient.js";

// 몬스터 처치 보상
export const monsterDie = (payload) => {
  // 점수 상승
  GameClient.getInstance().score = payload.userScore;

  // 골드 상승
  GameClient.getInstance().userGold = payload.userGold;
};

import GameClient from "../../Client/gameClient.js";

// 몬스터 사망 시 처리 (1마리 이상 한번에 처리)
export const monsterDie = (payload) => {
  // 점수 상승
  GameClient.getInstance().score = payload.userScore;

  // 골드 상승
  GameClient.getInstance().userGold = payload.userGold;

  // 몬스터 모두 삭제
  for (let i = 0; i < payload.diemonsterUUID.length; i++) {
    for (let x = 0; x < GameClient.getInstance().monsters.length; x++) {
      if (
        GameClient.getInstance().monsters[x].monsterUUID ===
        payload.diemonsterUUID[i]
      ) {
        GameClient.getInstance().monsters.splice(x, 1);
        break;
      }
    }
  }
};

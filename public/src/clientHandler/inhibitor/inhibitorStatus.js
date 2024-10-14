import GameClient from "../../Client/gameClient.js";

// 억제기 상태 업데이트
export const inhibitorStatusUpdate = (payload) => {
  GameClient.getInstance().inhibitor.status = payload.status;
  GameClient.getInstance().inhibitor.hp = payload.inhibitorHp;

  // 억제기 파괴 시 특수 몬스터 출현
  if (GameClient.getInstance(payload).inhibitor.status === "broken") {
    spawnSpecial(payload);
  }
};

import GameClient from "../../Client/gameClient.js";

// 억제기 체력 업데이트
export const monsterAttack = (payload) => {
  GameClient.getInstance().inhibitor.hp = payload.inhibitorHp;
};

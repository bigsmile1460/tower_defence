import GameClient from "../../Client/gameClient.js";

// 몬스터가 억제기 공격
export const monsterAttack = (payload) => {
  GameClient.getInstance().inhibitor.hp = payload.inhibitorHp;
  GameClient.getInstance().inhibitorHp = payload.inhibitorHp;
};

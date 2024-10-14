import GameClient from "../../Client/gameClient.js";
import { Monster } from "../../monster.js";

// 억제기 상태 업데이트
export const inhibitorStatusUpdate = (payload) => {
  GameClient.getInstance().inhibitor.status = payload.status;
  GameClient.getInstance().inhibitor.hp = payload.inhibitorHp;
  GameClient.getInstance().inhibitor.maxHp = payload.inhibitorHp;

  // 억제기 파괴 시 특수 억제기 몬스터 출현
  if (GameClient.getInstance(payload).inhibitor.status === "broken") {
    const specialMonster = new Monster(
      GameClient.getInstance().monsterPath,
      [GameClient.getInstance().specialMonsterImages],
      payload.specialMonster
    );
    specialMonster.width = 150;
    specialMonster.height = 200;
    GameClient.getInstance().monsters.push(specialMonster);
  }
};

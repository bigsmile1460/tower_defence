import GameClient from "../../Client/gameClient.js";

// 타워로부터 공격받은 몬스터 상태 업데이트
export const towerAttack = (payload) => {
  const clientMonsters = GameClient.getInstance().monsters;
  console.log("맞기 전: ", GameClient.getInstance().monsters);
  for (let i = 0; i < payload.attackedMonster.length; i++) {
    for (let clientMonster of clientMonsters) {
      if (clientMonster.monsterUUID === payload.attackedMonster[i].uuid) {
        clientMonster.hp = payload.attackedMonster[i].hp;
        break;
      }
    }
  }
  console.log("맞은 후: ", GameClient.getInstance().monsters);
};

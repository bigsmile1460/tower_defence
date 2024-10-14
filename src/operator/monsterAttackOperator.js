import { getMonsters } from "../Storages/monster.storage.js";
import {
  getInhibitorHp,
  getInhibitorStatus,
  setInhibitorHp,
} from "../Storages/stage.storage.js";
import { inhibitorBroken } from "./inhibitorBroken.js";

export const monsterAttackCheck = (socket, payload, userId) => {
  // 전달받은 uuid의 몬스터 공격력 조회
  const serverMonsters = getMonsters(userId);
  const monsterAttackPower = serverMonsters.find(
    (monster) => monster.uuid === payload.monsterUUID
  ).attack;

  // 억제기 체력 감소
  const serverInhibitorHp = getInhibitorHp(userId);
  const updateInhibitorHp = serverInhibitorHp - monsterAttackPower;
  setInhibitorHp(userId, updateInhibitorHp);

  // 억제기 파괴 여부 검사
  if (
    updateInhibitorHp <= 0 &&
    (getInhibitorStatus !== "broken" || getInhibitorStatus !== "brokend")
  ) {
    // 억제기 파괴 함수 호출
    inhibitorBroken(socket, userId);
  }

  // 클라이언트로 데이터 전달
  socket.emit("event", {
    handlerId: 11,
    payload: { inhibitorHp: updateInhibitorHp },
  });
};

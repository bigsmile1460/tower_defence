import { getMonsters } from "../Storages/monster.storage.js";
import {
  getInhibitorHp,
  getInhibitorHpLimit,
  getInhibitorStatus,
  setInhibitorHp,
} from "../Storages/stage.storage.js";
import { getTower } from "../Storages/tower.storage.js";
import { monsterDie } from "./monsterDieOperator.js";

// 타워 공격에대한 검증
class towerAttackOperator {
  // 타워 공격 검증
  towerAttackCheck(socket, payload, userId) {
    // 서버의 타워 데이터 조회
    const serverTower = getTower(userId, payload.id);
    if (!serverTower) {
      throw new Error(`존재하지 않는 타워 id 요청 입니다.`);
    }

    // 공격 간격과 타워 공격 스피드 비교
    const attackInterval = payload.lastAttack - serverTower.lastAttack;
    if (attackInterval < payload.attackSpeed) {
      throw new Error(
        `타워 공격 쿨 타임이 조작되었습니다. 경과시간: ${
          attackInterval / 1000
        }초 공격속도: ${payload.attackSpeed / 1000}초`
      );
    }

    // 공격 타입이 singleAttack인 경우
    if (serverTower.attackType === "singleAttack") {
      this.singleAttackCheck(socket, payload, userId, serverTower);
    }

    // 공격 타입이 multiAttack인 경우
    else if (serverTower.attackType === "multiAttack") {
      this.multiAttackCheck(socket, payload, userId, serverTower);
    }

    // 공격 타입이 heal인 경우
    else if (serverTower.attackType === "heal") {
      this.healAttackCheck(socket, payload, userId, serverTower);
    }

    // 잘못된 공격 타입
    else {
      throw new Error(
        `타워의 공격 타입이 잘못되었습니다: ${serverTower.attackType}`
      );
    }

    // 타워의 마지막 공격 시간 업데이트
    serverTower.lastAttack = payload.lastAttack;
  }

  // 공격 타입이 singleAttack인 경우
  singleAttackCheck(socket, payload, userId, serverTower) {
    // 공격 받은 몬스터가 여러 마리일 경우
    if (payload.monsterUUID.length > 1) {
      throw new Error(
        `singleAttack 타워가 여러차례 공격하였습니다: ${payload.monstersUUID.length}회`
      );
    }

    // 공격 받은 몬스터가 없을 경우
    if (payload.monsterUUID.length < 1) {
      throw new Error(`공격받은 몬스터가 없습니다.`);
    }

    // 제공 받은 몬스터 UUID를 통하여 공격받은 몬스터 조회
    const serverMonsters = getMonsters(userId);
    const attackedIndex = [];
    const attackedMonster = [];
    for (let i = 0; i < payload.monsterUUID.length; i++) {
      for (let x = 0; x < serverMonsters.length; x++) {
        if (serverMonsters[x].uuid === payload.monsterUUID[i]) {
          attackedIndex.push(x);
          attackedMonster.push(serverMonsters[x]);
          break;
        }
      }
    }

    // 공격 받은 몬스터의 체력상태 업데이트
    const deadIndex = [];
    const deadMonster = [];
    for (let i = 0; i < attackedIndex.length; i++) {
      serverMonsters[attackedIndex[i]].hp -= serverTower.attackPower;
      if (serverMonsters[attackedIndex[i]].hp <= 0) {
        deadIndex.push(attackedIndex[i]);
        deadMonster.push(serverMonsters[attackedIndex[i]]);
      }
    }

    // 업데이트 된 체력상태 클라이언트로 전달
    socket.emit("event", {
      handlerId: 13,
      payload: { attackedMonster: attackedMonster },
    });

    // 공격받아 사망한 몬스터 서버에서 삭제
    for (let i = 0; i < deadIndex.length; i++) {
      serverMonsters.splice(deadIndex[i] - i, 1);
    }

    // 삭제된 몬스터 존재 시 추가 처리 (점수, 골드 등..)
    if (deadMonster.length) {
      monsterDie(socket, userId, deadMonster);
    }
  }

  // 공격 타입이 multiAttack인 경우
  multiAttackCheck(socket, payload, userId, serverTower) {
    // 공격 받은 몬스터가 없을 경우
    if (payload.monsterUUID.length < 1) {
      throw new Error(`공격받은 몬스터가 없습니다.`);
    }

    // 제공 받은 몬스터 UUID를 통하여 공격받은 몬스터 조회
    const serverMonsters = getMonsters(userId);
    const attackedIndex = [];
    const attackedMonster = [];
    for (let i = 0; i < payload.monsterUUID.length; i++) {
      for (let x = 0; x < serverMonsters.length; x++) {
        if (serverMonsters[x].uuid === payload.monsterUUID[i]) {
          attackedIndex.push(x);
          attackedMonster.push(serverMonsters[x]);
          break;
        }
      }
    }

    // 공격 받은 몬스터의 체력상태 업데이트
    const deadIndex = [];
    const deadMonster = [];
    for (let i = 0; i < attackedIndex.length; i++) {
      serverMonsters[attackedIndex[i]].hp -= serverTower.attackPower;
      if (serverMonsters[attackedIndex[i]].hp <= 0) {
        deadIndex.push(attackedIndex[i]);
        deadMonster.push(serverMonsters[attackedIndex[i]]);
      }
    }

    // 업데이트 된 체력상태 클라이언트로 전달
    socket.emit("event", {
      handlerId: 13,
      payload: { attackedMonster: attackedMonster },
    });

    // 공격받아 사망한 몬스터 서버에서 삭제
    for (let i = 0; i < deadIndex.length; i++) {
      serverMonsters.splice(deadIndex[i] - i, 1);
    }

    // 삭제된 몬스터 존재 시 추가 처리 (점수, 골드 등..)
    if (deadMonster.length) {
      monsterDie(socket, userId, deadMonster);
    }
  }

  // 공격 타입이 heal인 경우
  healAttackCheck(socket, payload, userId, serverTower) {
    const serverInhibitorHp = getInhibitorHp(userId);
    const serverInhibitorstatus = getInhibitorStatus(userId);

    // 억제기가 파괴상태일 경우 (무의미한 로직 생략)
    if (serverInhibitorstatus === "broken") {
      serverTower.lastAttack = payload.lastAttack;
      return;
    }

    // 현재 체력 + 힐량 vs 최대체력 중 낮은값 구하기
    const updateInhibitorHp = Math.min(
      serverInhibitorHp + serverTower.attackPower,
      getInhibitorHpLimit(userId)
    );

    // 억제기 체력 상태 업데이트
    setInhibitorHp(userId, updateInhibitorHp);
  }
}

export default new towerAttackOperator();

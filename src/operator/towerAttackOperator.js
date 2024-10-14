import { getMonsters } from "../Storages/monster.storage.js";
import {
  getInhibitorHp,
  getInhibitorHpLimit,
  getInhibitorStatus,
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
    const serverMonsters = getMonsters(userId);

    // 몬스터 수가 다를 경우
    if (payload.monsters.length !== serverMonsters.length) {
      throw new Error(
        `몬스터 수가 다릅니다. 클라 정보: ${payload.monsters.length} 서버 정보: ${serverMonsters.length}`
      );
    }

    // 몬스터의 hp 감소수치와 타워의 공격력 비교 검증
    const dieMonsterIndex = [];
    let hitMonster = 0;
    for (let i = 0; i < payload.monsters.length; i++) {
      if (serverMonsters[i].hp !== payload.monsters[i].hp) {
        // 몬스터 체력이 정상적으로 차감된 경우
        if (
          serverMonsters[i].hp - payload.monsters[i].hp ===
          serverTower.attackPower
        ) {
          hitMonster++;
          // 몬스터 사망 시
          if (payload.monsters[i].hp <= 0) {
            dieMonsterIndex.push(i);
          }
          serverMonsters[i].hp = payload.monsters[i].hp;
        }

        // 몬스터 체력이 비정상적으로 차감된 경우
        else {
          throw new Error(
            `몬스터의 체력이 조작되었습니다: ${serverMonsters[i].hp} ${
              payload.monsters[i].hp + serverTower.attackPower
            }`
          );
        }
      }

      // 2명 이상 공격한 경우
      if (hitMonster > 1) {
        throw new Error(
          `단일 공격 타워가 여러차례 공격하였습니다. 공격횟수: ${hitMonster}`
        );
      }
    }

    // 사망한 몬스터 서버에서 삭제
    const deadMonster = [];
    for (let i = 0; i < dieMonsterIndex.length; i++) {
      deadMonster.push(serverMonsters[dieMonsterIndex[i] - i]);
      serverMonsters.splice(dieMonsterIndex[i] - i, 1);
    }

    // 삭제된 몬스터들 처리 (점수, 골드 등..)
    if (deadMonster.length) {
      monsterDie(socket, userId, deadMonster);
    }
  }

  // 공격 타입이 multiAttack인 경우
  multiAttackCheck(socket, payload, userId, serverTower) {
    const serverMonsters = getMonsters(userId);

    // 몬스터 수가 다를 경우
    if (payload.monsters.length !== serverMonsters.length) {
      throw new Error(
        `몬스터 수가 다릅니다. 서버 정보: ${payload.monsters.length} 클라 정보: ${serverMonsters.length}`
      );
    }

    // 몬스터의 hp 감소수치와 타워의 공격력 비교 검증
    const dieMonsterIndex = [];
    for (let i = 0; i < payload.monsters.length; i++) {
      if (serverMonsters[i].hp !== payload.monsters[i].hp) {
        // 몬스터 체력이 정상적으로 차감된 경우
        if (
          serverMonsters[i].hp - payload.monsters[i].hp ===
          serverTower.attackPower
        ) {
          // 몬스터 사망 시
          if (payload.monsters[i].hp <= 0) {
            dieMonsterIndex.push(i);
          }
          serverMonsters[i].hp = payload.monsters[i].hp;
        }

        // 몬스터 체력이 비정상적으로 차감된 경우
        else {
          throw new Error(
            `몬스터의 체력이 조작되었습니다. ${serverMonsters[i].hp} ${
              payload.monsters[i].hp + serverTower.attackPower
            } )`
          );
        }
      }
    }

    // 사망한 몬스터 서버에서 삭제
    const deadMonster = [];
    for (let i = 0; i < dieMonsterIndex.length; i++) {
      deadMonster.push(serverMonsters[dieMonsterIndex[i] - i]);
      serverMonsters.splice(dieMonsterIndex[i] - i, 1);
    }

    // 삭제된 몬스터들 처리 (점수, 골드 등..)
    if (deadMonster.length) {
      monsterDie(socket, userId, deadMonster);
    }
  }

  // 공격 타입이 heal인 경우
  healAttackCheck(socket, payload, userId, serverTower) {
    const serverInhibitorHp = getInhibitorHp(userId);
    const serverInhibitorstatus = getInhibitorStatus(userId);

    // 억제기가 파괴상태일 경우
    if (serverInhibitorstatus === "broken") {
      serverTower.lastAttack = payload.lastAttack;
      return;
    }

    // 힐량이 공격력보다 높을 경우
    if (payload.inhibitorHp > serverInhibitorHp + serverTower.attackPower) {
      throw new Error(
        `타워의 힐량이 조작되었습니다: 힐 수치: ${
          serverTower.attackPower
        } 증가된 체력: ${payload.inhibitorHp - serverInhibitorHp}`
      );
    }

    // 억제기 체력이 최대체력을 넘을 경우
    const serverInhiitorLimit = getInhibitorHpLimit(userId);
    if (payload.inhibitorHp > serverInhiitorLimit) {
      throw new Error(
        `억제기의 체력이 최대치를 능가하였습니다. 최대 체력: ${serverInhiitorLimit}  클라이언트 체력: ${payload.inhibitorHp}`
      );
    }
  }
}

export default new towerAttackOperator();

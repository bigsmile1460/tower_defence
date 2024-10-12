import { getTower } from "../Storages/tower.storage.js";

class towerAttackOperator {
  // 타워 공격 검증
  towerAttackCheck(payload, userId) {
    // 타워 공격 간격과 타워 공격 스피드 비교
    let serverTower = getTower(userId, payload.id);
    const attackInterval = payload.lastAttack - serverTower.lastAttack;
    if (attackInterval < payload.attackSpeed) {
      throw new Error(
        `타워 공격 쿨 타임이 조작되었습니다. 경과시간: ${
          attackInterval / 1000
        }초 공격속도: ${payload.attackSpeed / 1000}초`
      );
    }

    // 공격 타입이 singleAttack인 경우
    const serverMonsters = getMonsters(userId);
    if (payload.attackType === "singleAttack") {
      const hitMonster = 0;
      for (let i = 0; i < payload.monsters.length; i++) {
        // 몬스터 정보가 조작된 경우
        if (payload.monsters[i].id !== serverMonsters[i].id) {
          throw new Error(
            `몬스터 정보가 조작되었습니다. 서버 정보: ${serverMonsters[i]} 클라 정보: ${payload.monsters[i]}`
          );
        }

        // 몬스터의 hp 감소수치와 타워의 공격력 비교 검증
        if (serverMonsters[i].hp !== payload.monsters[i].hp) {
          if (
            serverMonsters[i].hp - payload.monsters[i].hp ===
            serverTower.attackPower
          ) {
            hitMonster++;
          } else {
            throw new Error(
              `몬스터의 체력이 조작되었습니다: ${serverMonsters[i].hp} ${
                monsters[i].hp + serverTower.attackPower
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
    }

    // 공격 타입이 multiAttack인 경우
    else if (payload.attackType === "multiAttack") {
      for (let i = 0; i < monsters.length; i++) {
        // 몬스터 정보가 조작된 경우
        if (payload.monsters[i].id !== serverMonsters[i].id) {
          throw new Error(
            `몬스터 정보가 조작되었습니다. 서버 정보: ${serverMonsters[i]} 클라 정보: ${payload.monsters[i]}`
          );
        }

        // 몬스터의 hp 감소수치와 타워의 공격력 비교 검증
        if (serverMonsters[i].hp !== payload.monsters[i].hp) {
          if (
            serverMonsters[i].hp - payload.monsters[i].hp ===
            payload.attackPower
          ) {
          } else {
            throw new Error(
              `몬스터의 체력이 조작되었습니다. ${serverMonsters[i].hp} ${
                payload.monsters[i].hp + serverTower.attackPower
              } )`
            );
          }
        }
      }
    }

    // 공격 타입이 heal인 경우
    else if (payload.attackType === "heal") {
      const serverInhiitor = getInhibitor(userId);
      if (payload.inhibitorHp > serverInhiitor.hp + payload.attackPower) {
        throw new Error(
          `타워의 힐량이 조작되었습니다: 힐 수치: ${
            payload.attackPower
          } 증가된 체력: ${payload.inhibitorHp - serverInhiitor.hp}`
        );
      }

      if (payload.inhibitorHp > serverInhiitor.maxHp) {
        throw new Error(
          `억제기의 체력이 최대치를 능가하였습니다. 최대체력: ${serverInhiitor.maxHp}  실제 체력: ${payload.inhibitorHp}`
        );
      }
    } else {
      throw new Error(`타워의 공격 타입이 잘못되었습니다: ${tower.attackType}`);
    }

    // 타워의 마지막 공격 시간 업데이트
    serverTower.lastAttack = payload.tower.lastAttack;
  }
}

export default new towerAttackOperator();

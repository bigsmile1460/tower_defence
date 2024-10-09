import { getMonsters, getTower } from "../models/model.js";

class towerAttackOperator {
  // 타워 공격 검증
  towerAttackCheck(tower, monsters, inhibitor, userId) {
    // 타워 공격 간격과 타워 공격 스피드 비교
    const serverTower = getTower(userId, tower.id);
    const attackInterval = tower.lastAttack - serverTower.lastAttack;
    if (attackInterval < tower.attackSpeed) {
      throw new Error(
        "타워 공격 쿨 타임이 조작되었습니다: " +
          attackInterval +
          tower.attackSpeed
      );
    }

    // 공격 타입이 singleAttack인 경우
    const serverMonsters = getMonsters(userId);
    if (tower.attackType === "singleAttack") {
      const hitMonster = 0;
      for (let i = 0; i < monsters.length; i++) {
        // 몬스터 정보가 조작된 경우
        if (monsters[i].id !== serverMonsters[i].id) {
          throw new Error(
            "서버와 클라이언트의 몬스터 정보가 다릅니다: " +
              serverMonsters[i] +
              monsters[i]
          );
        }

        // 감소된 몬스터hp 검증
        if (serverMonsters[i].hp !== monsters[i].hp) {
          if (serverMonsters[i].hp - monsters[i].hp === tower.attackPower) {
            hitMonster++;
          } else {
            throw new Error(
              "몬스터의 체력이 조작되었습니다: " +
                (serverMonsters[i].hp - monsters[i].hp) +
                tower.attackPower
            );
          }
        }

        // 2명 이상 공격한 경우
        if (hitMonster > 1) {
          throw new Error(
            "단일 공격 타워가 여러차례 공격하였습니다. 공격횟수: " + hitMonster
          );
        }
      }
    }

    // 공격 타입이 multiAttack인 경우
    else if (tower.attackType === "multiAttack") {
      for (let i = 0; i < monsters.length; i++) {
        // 몬스터 정보가 조작된 경우
        if (monsters[i].id !== serverMonsters[i].id) {
          throw new Error(
            "서버와 클라이언트의 몬스터 정보가 다릅니다: " +
              serverMonsters[i] +
              monsters[i]
          );
        }

        // 감소된 몬스터hp 검증
        if (serverMonsters[i].hp !== monsters[i].hp) {
          if (serverMonsters[i].hp - monsters[i].hp === tower.attackPower) {
          } else {
            throw new Error(
              "몬스터의 체력이 조작되었습니다: " +
                (serverMonsters[i].hp - monsters[i].hp) +
                tower.attackPower
            );
          }
        }
      }
    }

    // 공격 타입이 heal인 경우
    else if (tower.attackType === "heal") {
      const serverInhiitor = getInhibitor;
      if (inhibitor.hp > serverInhiitor.hp + tower.attackPower) {
        throw new Error(
          "타워의 힐량이 조작되었습니다: " +
            tower.attackPower +
            (inhibitor.hp - serverInhiitor.hp)
        );
      }

      if (inhibitor.hp > inhibitor.maxHp) {
        throw new Error(
          "억제기의 체력이 최대치를 능가하였습니다. 최대체력: " +
            inhibitor.maxHp +
            inhibitor.hp
        );
      }
    } else {
      throw new Error("타워의 공격 타입이 잘못되었습니다: " + tower.attackType);
    }
  }
}

export default new towerAttackOperator();

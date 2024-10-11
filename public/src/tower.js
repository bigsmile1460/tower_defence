import { getLocalStorage } from "./Local/localStorage.js";
import UserSocket from "./Network/userSocket.js";

export class Tower {
  constructor(x, y, towerId, cost, upgradeCost, upgradeAttackPower) {
    // 생성자 안에서 타워들의 속성을 정의한다고 생각하시면 됩니다!
    this.id = getLocalStorage("towerInfo").id; // 타워id(인 게임에서 타워의 고유 아이디)
    this.towerId = towerId; // DB상의 타워id
    this.x = x; // 타워 이미지 x 좌표
    this.y = y; // 타워 이미지 y 좌표
    this.width = 78; // 타워 이미지 가로 길이 (이미지 파일 길이에 따라 변경 필요하며 세로 길이와 비율을 맞춰주셔야 합니다!)
    this.height = 150; // 타워 이미지 세로 길이
    this.attackPower = getLocalStorage("towerInfo").attackPower; // 타워 공격력
    this.attackSpeed = getLocalStorage("towerInfo").attackSpeed; // 타워 공격 속도 ( /60 (초))
    this.attackRange = getLocalStorage("towerInfo").attackRange; // 타워 사거리
    this.lastAttack = 0;
    this.attackType = getLocalStorage("towerInfo").attackType; // 타워 공격 유형
    this.level = 1; // 타워 레벨
    this.cost = cost; // 타워 구입 비용
    this.upgradeCost = upgradeCost; // 타워 강화 비용
    this.upgradeAttackPower = upgradeAttackPower; // 타워 강화시 능력치 상승
    this.cooldown = 0; // 남은 쿨타임
    this.beamDuration = 0; // 남은 광선 지속 시간
    this.target = null; // 타워 광선의 목표
  }

  draw(ctx, towerImage) {
    ctx.drawImage(towerImage, this.x, this.y, this.width, this.height);
    if (this.beamDuration > 0 && this.target) {
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
      ctx.lineTo(
        this.target.x + this.target.width / 2,
        this.target.y + this.target.height / 2
      );
      ctx.strokeStyle = "skyblue";
      ctx.lineWidth = 10;
      ctx.stroke();
      ctx.closePath();
      this.beamDuration--;
    }
  }

  singleAttack(tower, monsters) {
    console.log(`tower2`);
    // 공격 유형이 단일공격이 아닐 경우 함수 종료
    if (tower.attackType !== "singleAttack") {
      return;
    }

    console.log(`tower`);
    // 공격 쿨 타임이 남아있을 경우 함수 종료
    if (this.cooldown > 0) {
      return;
    }

    // 생성된 순서대로 각 몬스터에 대한 공격여부 체크 (1명이라도 공격 시 다음으로)
    let attack = false;
    for (let monster of monsters) {
      const distance = Math.sqrt(
        Math.pow(tower.x - monster.x, 2) + Math.pow(tower.y - monster.y, 2)
      );
      if (distance < tower.attackRange) {
        monster.hp -= this.attackPower;
        this.cooldown = this.attackSpeed; // 남은 쿨타임 = 공격 속도 (초당 60프레임)
        this.beamDuration = 30; // 광선 지속 시간 (0.5초)
        this.target = monster; // 광선의 목표 설정
        attack = true;
        break;
      }
    }

    // 공격 범위 안에 적이 없어서 공격 실패 시 함수 종료
    if (!attack) {
      return;
    }

    // 공격 성고 시 서버에 공격 결과 전달
    console.log("서버에 단일 공격 타워의 공격 실행 전달");
    this.lastAttack = Date.now();
    UserSocket.GetInstance().socket.emit("event", {
      userID: null,
      clientVersion: null,
      handlerId: 7,
      payload: {
        tower: tower,
        monsters: monsters,
      },
    });
  }

  multiAttack(tower, monsters) {
    // 공격 유형이 다중공격이 아닐 경우 함수 종료
    if (tower.attackType !== "multiAttack") {
      return;
    }

    // 공격 쿨 타임이 남아있을 경우 함수 종료
    if (this.cooldown > 0) {
      return;
    }

    // 생성된 순서대로 몬스터에 대한 공격여부 체크
    let attack = false;
    for (let monster of monsters) {
      const distance = Math.sqrt(
        Math.pow(tower.x - monster.x, 2) + Math.pow(tower.y - monster.y, 2)
      );
      if (distance < tower.attackRange) {
        monster.hp -= this.attackPower;
        this.cooldown = this.attackSpeed; // 남은 쿨타임 = 공격 속도 (초당 60프레임)
        this.beamDuration = 30; // 광선 지속 시간 (0.5초)
        this.target = monster; // 광선의 목표 설정
        attack = true;
      }
    }

    // 공격 범위 안에 적이 없어서 공격 실패 시 함수 종료
    if (!attack) {
      return;
    }

    // 공격 성고 시 서버에 공격 결과 전달
    console.log("서버에 다중 공격 타워의 공격 실행 전달");
    this.lastAttack = Date.now();
    UserSocket.GetInstance().socket.emit("event", {
      userID: null,
      clientVersion: null,
      handlerId: 7,
      payload: {
        tower: tower,
        monsters: monsters,
      },
    });
  }

  heal(tower, base) {
    // 공격 유형이 힐이 아닐 경우 함수 종료
    if (tower.attackType !== "heal") {
      return;
    }

    // 힐 쿨 타임이 남아있을 경우 함수 종료
    if (this.cooldown > 0) {
      return;
    }

    base.hp = Math.min(base.hp + this.attackPower, base.maxHp);
    this.cooldown = this.attackSpeed; // 남은 쿨타임 = 공격 속도 (초당 60프레임)
    this.beamDuration = 30; // 광선 지속 시간 (0.5초)
    this.target = base; // 광선의 목표 설정

    // 힐 성고 시 서버에 힐 결과 전달
    console.log("서버에 힐 타워의 힐 실행 전달");
    this.lastAttack = Date.now();
    UserSocket.GetInstance().socket.emit("event", {
      userID: null,
      clientVersion: null,
      handlerId: 7,
      payload: {
        tower: tower,
        base: base,
      },
    });
  }

  updateCooldown() {
    this.cooldown--;
  }

  upgradeTower(userGold) {
    // 돈이 부족한 경우 함수 종료
    if (userGold < this.upgradeCost) {
      return alert("돈이 부족합니다");
    }

    let gold = userGold - this.upgradeCost;
    this.attackPower += this.upgradeAttackPower;
    this.level += 1;

    UserSocket.GetInstance().socket.emit("event", {
      userID: null,
      clientVersion: null,
      handlerId: 8,
      payload: {
        gold: gold,
        tower: this,
      },
    });

    return gold;
  }
}

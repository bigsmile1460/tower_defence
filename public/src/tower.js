import GameClient from "./Client/gameClient.js";
import { HEAL, MULTI_ATTACK, SINGLE_ATTACK } from "./constants.js";
import UserSocket from "./Network/userSocket.js";

export class Tower {
  constructor(x, y, id, towerData, lastAttack) {
    // 생성자 안에서 타워들의 속성을 정의한다고 생각하시면 됩니다!
    this.id = id; // 타워id(인 게임에서 타워의 고유 아이디)
    this.x = x; // 타워 이미지 x 좌표
    this.y = y; // 타워 이미지 y 좌표
    this.width = 78; // 타워 이미지 가로 길이 (이미지 파일 길이에 따라 변경 필요하며 세로 길이와 비율을 맞춰주셔야 합니다!)
    this.height = 150; // 타워 이미지 세로 길이
    this.name = towerData.towerName;
    this.attackPower = towerData.attackPower; // 타워 공격력
    this.attackSpeed = towerData.attackSpeed; // 타워 공격 속도 (단위 (ms))
    this.attackRange = towerData.attackRange; // 타워 사거리
    this.lastAttack = lastAttack; // 타워의 마지막 공격 시간
    this.attackType = towerData.attackType; // 타워 공격 유형
    this.towerPrice = towerData.towerPrice; // 타워 비용 (강화에 들어간 비용 합산)
    this.sellPriceRate = towerData.sellPriceRate; // 타워 판매 가격 비율 (판매 가격 비율 * 타워 비용 = 판매 가격)
    this.upgradePrice = towerData.upgradePrice; // 타워 업그레이드 가격
    this.upgradeAttackPower = towerData.upgradeAttackPower; // 강화 시 타워 능력치 상승 수치
    this.upgradeAddPrice = towerData.upgradeAddPrice; // 타워 업그레이드 시 다음 업그레이드 가격 증가
    this.level = 1; // 타워 레벨
    this.beamDuration = 0; // 남은 광선 지속 시간
    this.target = []; // 타워 광선의 목표
  }

  draw(ctx, singletowerImage, multiAttackTowerImage, healTowerImage) {
    switch (this.attackType) {
      case SINGLE_ATTACK:
        ctx.drawImage(
          singletowerImage,
          this.x,
          this.y,
          this.width,
          this.height
        );
        break;
      case MULTI_ATTACK:
        ctx.drawImage(
          multiAttackTowerImage,
          this.x,
          this.y,
          this.width,
          this.height
        );
        break;
      case HEAL:
        ctx.drawImage(healTowerImage, this.x, this.y, this.width, this.height);
        break;
    }
    if (this.beamDuration > 0 && this.target.length) {
      for (let i = 0; i < this.target.length; i++) {
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
        switch (this.attackType) {
          case SINGLE_ATTACK:
            ctx.lineTo(
              this.target[i].x + this.target[i].width / 2,
              this.target[i].y + this.target[i].height / 2
            );
            break;
          case MULTI_ATTACK:
            ctx.lineTo(
              this.target[i].x + this.target[i].width / 2,
              this.target[i].y + this.target[i].height / 2
            );
            break;
          case HEAL:
            ctx.lineTo(
              this.target[i].x - 100 + this.target[i].width / 2,
              this.target[i].y - 100 + this.target[i].height / 2
            );
            break;
        }
        switch (this.attackType) {
          case SINGLE_ATTACK:
            ctx.strokeStyle = "red";
            break;
          case MULTI_ATTACK:
            ctx.strokeStyle = "skyblue";
            break;
          case HEAL:
            ctx.strokeStyle = "blue";
            break;
        }
        ctx.lineWidth = 10;
        ctx.stroke();
        ctx.closePath();
      }
      this.beamDuration--;
    }
  }

  singleAttack(monsters) {
    // 공격 유형이 단일공격이 아닐 경우 함수 종료
    if (this.attackType !== SINGLE_ATTACK) {
      return;
    }

    // 공격 쿨 타임이 남아있을 경우 함수 종료
    if (this.lastAttack + this.attackSpeed > Date.now()) {
      return;
    }

    // 생성된 순서대로 각 몬스터에 대한 공격 가능 여부 체크 (1명이라도 공격 시 다음으로)
    let attack = false;
    const monsterUUID = [];
    for (let monster of monsters) {
      const distance = Math.sqrt(
        Math.pow(this.x - monster.x, 2) + Math.pow(this.y - monster.y, 2)
      );
      if (distance < this.attackRange) {
        monster.hp -= this.attackPower; // 몬스터 체력 감소
        monsterUUID.push(monster.monsterUUID); // 공격 대상 담아두기
        this.beamDuration = 30; // 광선 지속 시간 (30프레임)
        this.target = [monster]; // 광선의 목표 설정
        attack = true;
        break;
      }
    }

    // 공격 범위 안에 적이 없어서 공격 실패 시 함수 종료
    if (!attack) {
      return;
    }

    // 사운드 재생
    const audio = new Audio("../../sounds/singleTower.mp3");
    audio.play();
    audio.loop = false; // 반복재생
    audio.volume = 0.04 * GameClient.getInstance().effectVolume; // 음량 설정

    // 공격 신호 서버에 전달
    this.lastAttack = Date.now();
    UserSocket.getInstance().SendEvent(7, {
      id: this.id,
      lastAttack: this.lastAttack,
      monsterUUID: monsterUUID,
    });
  }

  multiAttack(monsters) {
    // 공격 유형이 다중공격이 아닐 경우 함수 종료
    if (this.attackType !== MULTI_ATTACK) {
      return;
    }

    // 공격 쿨 타임이 남아있을 경우 함수 종료
    if (this.lastAttack + this.attackSpeed > Date.now()) {
      return;
    }

    // 생성된 순서대로 몬스터에 대한 공격여부 체크
    let attack = false;
    const monsterUUID = [];
    this.target = [];
    for (let monster of monsters) {
      const distance = Math.sqrt(
        Math.pow(this.x - monster.x, 2) + Math.pow(this.y - monster.y, 2)
      );
      if (distance < this.attackRange) {
        monster.hp -= this.attackPower; // 몬스터 체력 감소
        monsterUUID.push(monster.monsterUUID); // 공격 대상 담아두기
        this.beamDuration = 30; // 광선 지속 시간 (0.5초)
        this.target.push(monster); // 광선의 목표 설정
        attack = true;
      }
    }

    // 공격 범위 안에 적이 없어서 공격 실패 시 함수 종료
    if (!attack) {
      return;
    }

    // 사운드 재생
    const audio = new Audio("../../sounds/muitiTower.mp3");
    audio.play();
    audio.loop = false; // 반복재생
    audio.volume = 0.04 * GameClient.getInstance().effectVolume; // 음량 설정

    // 공격 신호 서버에 전달
    this.lastAttack = Date.now();
    UserSocket.getInstance().SendEvent(7, {
      id: this.id,
      lastAttack: this.lastAttack,
      monsterUUID: monsterUUID,
    });
  }

  heal(inhibitor) {
    // 공격 유형이 힐이 아닐 경우 함수 종료
    if (this.attackType !== HEAL) {
      return;
    }

    // 공격 쿨 타임이 남아있을 경우 함수 종료
    if (this.lastAttack + this.attackSpeed > Date.now()) {
      return;
    }

    // 사운드 재생
    const audio = new Audio("../../sounds/healTower.mp3");
    audio.play();
    audio.loop = false; // 반복재생
    audio.volume = 0.04 * GameClient.getInstance().effectVolume; // 음량 설정

    inhibitor.hp = Math.min(inhibitor.hp + this.attackPower, inhibitor.maxHp);
    this.beamDuration = 30; // 광선 지속 시간 (0.5초)
    this.target = [inhibitor]; // 광선의 목표 설정

    // 공격 성고 시 서버에 공격 결과 전달
    this.lastAttack = Date.now();
    UserSocket.getInstance().SendEvent(7, {
      id: this.id,
      lastAttack: this.lastAttack,
    });
  }

  buttonMake() {
    // 업그레이드 버튼
    const upgradeButton = document.createElement("button");
    upgradeButton.textContent = "강화 비용" + this.upgradePrice + "원";
    upgradeButton.style.position = "absolute";
    upgradeButton.style.top = this.y + 200 + "px";
    upgradeButton.style.right = 2050 - this.x + "px";
    upgradeButton.style.padding = "50px 100";
    upgradeButton.style.fontSize = "30";
    upgradeButton.style.cursor = "pointer";
    document.body.appendChild(upgradeButton);
    upgradeButton.addEventListener("click", () => {
      if (GameClient.getInstance().userGold >= this.upgradePrice) {
        UserSocket.getInstance().SendEvent(8, this.id);
        if (GameClient.getInstance().userGold >= this.upgradePrice) {
          upgradeButton.textContent =
            "강화 비용" +
            (Number(this.upgradeAddPrice) + Number(this.upgradePrice)) +
            "원";
          sellButton.textContent = "LV" + (this.level + 1) + this.name + "판매";
          combatPower.textContent =
            "전투력: " +
            Math.ceil(Math.sqrt(this.towerPrice + this.upgradePrice));
        }
      }
    });
    this.upgradeButton = upgradeButton;

    // 판매 버튼
    const sellButton = document.createElement("button");
    sellButton.textContent = "LV" + this.level + this.name + "판매";
    sellButton.style.position = "absolute";
    sellButton.style.top = this.y + 225 + "px";
    sellButton.style.right = 2050 - this.x + "px";
    sellButton.style.padding = "50px 100";
    sellButton.style.fontSize = "30";
    sellButton.style.cursor = "pointer";
    document.body.appendChild(sellButton);
    sellButton.addEventListener("click", () => {
      UserSocket.getInstance().SendEvent(10, this.id);
    });
    this.sellButton = sellButton;

    // 전투력 표기
    const combatPower = document.createElement("button");
    combatPower.textContent =
      "전투력: " + Math.ceil(Math.sqrt(this.towerPrice));
    combatPower.style.position = "absolute";
    combatPower.style.top = this.y + 250 + "px";
    combatPower.style.right = 2070 - this.x + "px";
    combatPower.style.padding = "50px 100";
    combatPower.style.fontSize = "30";
    document.body.appendChild(combatPower);
    this.combatPower = combatPower;
  }
}

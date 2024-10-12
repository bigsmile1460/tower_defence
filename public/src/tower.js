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
    this.level = 1; // 타워 레벨
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

  singleAttack(monsters) {
    // 공격 유형이 단일공격이 아닐 경우 함수 종료
    if (this.attackType !== "singleAttack") {
      return;
    }

    // 공격 쿨 타임이 남아있을 경우 함수 종료
    if (this.lastAttack + this.attackSpeed > Date.now()) {
      return;
    }

    // 생성된 순서대로 각 몬스터에 대한 공격여부 체크 (1명이라도 공격 시 다음으로)
    let attack = false;
    for (let monster of monsters) {
      const distance = Math.sqrt(
        Math.pow(this.x - monster.x, 2) + Math.pow(this.y - monster.y, 2)
      );
      if (distance < this.attackRange) {
        monster.hp -= this.attackPower;
        this.beamDuration = 30; // 광선 지속 시간 (30프레임)
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
    this.lastAttack = Date.now();
    UserSocket.GetInstance().SendEvent(7, {
      id: this.id,
      towerId: this.towerId,
      lastAttack: this.lastAttack,
      monsters: monsters,
    });
  }

  multiAttack(monsters) {
    // 공격 유형이 다중공격이 아닐 경우 함수 종료
    if (this.attackType !== "multiAttack") {
      return;
    }

    // 공격 쿨 타임이 남아있을 경우 함수 종료
    if (this.lastAttack + this.attackSpeed > Date.now()) {
      return;
    }

    // 생성된 순서대로 몬스터에 대한 공격여부 체크
    let attack = false;
    for (let monster of monsters) {
      const distance = Math.sqrt(
        Math.pow(this.x - monster.x, 2) + Math.pow(this.y - monster.y, 2)
      );
      if (distance < this.attackRange) {
        monster.hp -= this.attackPower;
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
    this.lastAttack = Date.now();
    UserSocket.GetInstance().SendEvent(7, {
      id: this.id,
      towerId: this.towerId,
      lastAttack: this.lastAttack,
      monsters: monsters,
    });
  }

  heal(inhibitor) {
    // 공격 유형이 힐이 아닐 경우 함수 종료
    if (this.attackType !== "heal") {
      return;
    }

    // 공격 쿨 타임이 남아있을 경우 함수 종료
    if (this.lastAttack + this.attackSpeed > Date.now()) {
      return;
    }

    inhibitor.hp = Math.min(inhibitor.hp + this.attackPower, inhibitor.maxHp);
    this.beamDuration = 30; // 광선 지속 시간 (0.5초)
    this.target = inhibitor; // 광선의 목표 설정

    // 공격 성고 시 서버에 공격 결과 전달
    this.lastAttack = Date.now();
    UserSocket.GetInstance().SendEvent(7, {
      id: this.id,
      towerId: this.towerId,
      lastAttack: this.lastAttack,
      inhibitor: inhibitor,
    });
  }

  upgradeTower(userGold) {
    // 돈이 부족한 경우 함수 종료
    if (userGold < this.upgradeCost) {
      return alert("돈이 부족합니다");
    }

    let gold = userGold - this.upgradeCost;
    this.attackPower += this.upgradeAttackPower;
    this.level += 1;

    // 업그레이드 성공 시 서버에 결과 전달
    UserSocket.GetInstance().SendEvent(8, {
      userGold: userGold,
      attackPower: this.attackPower,
    });

    return gold;
  }

  buttonMake() {
    // 업그레이드 버튼
    const upgradeButton = document.createElement("button");
    upgradeButton.textContent = "레벨" + (this.level + 1) + "로강화";
    upgradeButton.style.position = "absolute";
    upgradeButton.style.top = this.y + 300 + "px";
    upgradeButton.style.right = 1810 - this.x + "px";
    upgradeButton.style.padding = "50px 100";
    upgradeButton.style.fontSize = "30";
    upgradeButton.style.cursor = "pointer";
    document.body.appendChild(upgradeButton);
    upgradeButton.addEventListener("click", () => {
      alert("강화하고 싶쥐?!");
    });

    // 판매 버튼
    const sellButton = document.createElement("button");
    sellButton.textContent = this.name + "판매";
    sellButton.style.position = "absolute";
    sellButton.style.top = this.y + 275 + "px";
    sellButton.style.right = 1790 - this.x + "px";
    sellButton.style.padding = "50px 100";
    sellButton.style.fontSize = "30";
    sellButton.style.cursor = "pointer";
    document.body.appendChild(sellButton);
    sellButton.addEventListener("click", () => {
      alert("판매하고 싶쥐?!");
    });
  }
}

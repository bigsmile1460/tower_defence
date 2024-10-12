import UserSocket from "../Network/userSocket.js";
import pathManager from "../path.js";
import { Monster } from "../monster.js";
import { Inhibitor } from "../base.js";
import Player from "../player.js";
import { getLocalStorage } from "../Local/localStorage.js";
class GameClient {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.player = new Player(this.ctx, 60, 60); // 플레이어
    this.userGold = 0; // 유저 돈
    this.inhibitor = null; // 억제기
    this.inhibitorHp = 0; // 억제기 체력
    this.towerCost = 0; // 타워 구입시 가격
    this.numOfInitialTowers = 0; // 게임 시작시 타워 자동 생성 -> 없어도 됨
    this.monsterLevel = 1; // 몬스터 레벨
    this.monsterSpawnInterval = 1000; // 몬스터 스폰시간
    this.monsters = []; // 몬스터 저장 배열
    this.towers = []; // 타워 저장 배열
    this.score = 2000; // 현재 플레이어의 스코어
    this.highScore = 0; // 현재 서버 최고 스코어
    this.backgroundImage = null; // 배경 이미지
    this.towerImage = null; // 타워 이미지
    this.inhibitorImage = null; // 억제기 이미지
    this.pathImage = null; // 경로 이미지
    this.monsterImages = []; // 몬스터 이미지
    this.NUM_OF_MONSTERS = 5;
    this.monsterPath = null; // 몬스터가 지나가는 경로
    this.path = null; // 경로
    //this.monsterPath = null; => 중첩된 거 같아서 주석처리 했습니다.
    this.startTime = 0; // 게임 시작 시간
    this.elpsedTime = 0; // 게임 종료 시간
    this.buySingleTowerButton = document.createElement("button");
    this.buySingleTowerButton.textContent = "단일 공격 타워 구입";
    this.buySingleTowerButton.style.position = "absolute";
    this.buySingleTowerButton.style.top = "10px";
    this.buySingleTowerButton.style.right = "10px";
    this.buySingleTowerButton.style.padding = "10px 20px";
    this.buySingleTowerButton.style.fontSize = "16px";
    this.buySingleTowerButton.style.cursor = "pointer";
    document.body.appendChild(this.buySingleTowerButton);
    this.buySingleTowerButton.addEventListener("click", () => {
      UserSocket.GetInstance().SendEvent(9, {
        towerId: 1,
        timeStamp: Date.now(),
      });
    });

    this.buyRangeTowerButton = document.createElement("button");
    this.buyRangeTowerButton.textContent = "범위 공격 타워 구입";
    this.buyRangeTowerButton.style.position = "absolute";
    this.buyRangeTowerButton.style.top = "60px";
    this.buyRangeTowerButton.style.right = "10px";
    this.buyRangeTowerButton.style.padding = "10px 20px";
    this.buyRangeTowerButton.style.fontSize = "16px";
    this.buyRangeTowerButton.style.cursor = "pointer";
    document.body.appendChild(this.buyRangeTowerButton);
    this.buySingleTowerButton.addEventListener("click", () => {
      UserSocket.GetInstance().SendEvent(9, {
        towerId: 2,
        timeStamp: Date.now(),
      });
    });

    this.buyHealTowerButton = document.createElement("button");
    this.buyHealTowerButton.textContent = "힐 타워 구입";
    this.buyHealTowerButton.style.position = "absolute";
    this.buyHealTowerButton.style.top = "110px";
    this.buyHealTowerButton.style.right = "10px";
    this.buyHealTowerButton.style.padding = "10px 20px";
    this.buyHealTowerButton.style.fontSize = "16px";
    this.buyHealTowerButton.style.cursor = "pointer";
    document.body.appendChild(this.buyHealTowerButton);
    this.buySingleTowerButton.addEventListener("click", () => {
      UserSocket.GetInstance().SendEvent(9, {
        towerId: 3,
        timeStamp: Date.now(),
      });
    });
  }
  static GetInstance() {
    if (!this.gInstance) {
      this.gInstance = new GameClient();
    }
    return this.gInstance;
  }
  SetStageInfo(stages) {
    this.stages = stages;
    this.userGold += stages.stageInfo.gold;
    this.inhibitorHp = this.inhibitor.setHp(stages.stageInfo.inhibitorHp);
  }

  placeinhibitor() {
    const lastPoint = this.monsterPath[this.monsterPath.length - 1];
    this.inhibitor = new Inhibitor(lastPoint.x, lastPoint.y, this.inhibitorHp);
  }
  SpawnMonster() {
    this.monsters.push(
      new Monster(this.monsterPath, this.monsterImages, this.monsterLevel)
    );
  }
  LoadGameImages(infos) {
    this.backgroundImage = infos.backgroundImage;
    this.towerImage = infos.towerImage;
    this.inhibitorImage = infos.inhibitorImage;
    this.pathImage = infos.pathImage;
    this.monsterImages = infos.monsterImages;
    this.ctx.drawImage(
      this.backgroundImage,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }
  GameStart(stages, highScore) {
    this.stages = stages;
    this.userGold += stages.stageInfo.gold;
    this.inhibitorHp = stages.stageInfo.inhibitorHp;
    this.highScore = highScore ? highScore : this.highScore;
    this.startTime = Date.now();
    this.elpsedTime = Date.now();
    this.path = new pathManager(this.canvas, this.ctx, this.pathImage, 60, 60);
    this.monsterPath = this.path.generateRandomMonsterPath();
    this.path.drawPath(this.monsterPath);
    this.placeinhibitor();
    this.GameLoop();
  }
  async GameLoop() {
    this.ctx.drawImage(
      this.backgroundImage,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    this.path.drawPath(this.monsterPath);
    this.player.draw();

    this.inhibitor.draw(this.ctx, this.inhibitorImage);
    this.elpsedTime++;
    // 몬스터 300마리 이상 존재시 게임오버
    if (this.monsters.length > 300) {
      UserSocket.GetInstance().SendEvent(3, { score: this.score });
      alert(`게임 오버`);
    }

    // 일정 시간이 지날 경우 스테이지 변경
    if ((this.elpsedTime - this.startTime) % 500 === 0) {
      UserSocket.GetInstance().SendEvent(2, {
        elpsedTime: this.elpsedTime,
      });
    }
    this.ctx.font = "25px Times New Roman";
    this.ctx.fillStyle = "skyblue";
    this.ctx.fillText(`최고 기록: ${this.highScore}`, 100, 50); // 최고 기록 표시
    this.ctx.fillStyle = "white";
    this.ctx.fillText(`점수: ${this.score}`, 100, 100); // 현재 스코어 표시
    this.ctx.fillStyle = "yellow";
    this.ctx.fillText(`골드: ${this.userGold}`, 100, 150); // 골드 표시
    if (this.stages) {
      this.ctx.fillStyle = "red";
      this.ctx.fillText(
        `현재 스테이지: ${this.stages.stageInfo.stageId}`,
        100,
        200
      ); // 현재 스테이지 표시
    }
    this.towers.forEach((tower) => {
      tower.draw(this.ctx, this.towerImage);
      tower.singleAttack(this.monsters); // 단일 공격
      tower.multiAttack(this.monsters); // 다중 공격
      tower.heal(this.inhibitor); // 힐
    });
    this.inhibitor.draw(this.ctx, this.inhibitorImage);
    for (let i = this.monsters.length - 1; i >= 0; i--) {
      const monster = this.monsters[i];
      if (monster.hp > 0) {
        const isDestroyed = monster.move(this.inhibitor);
        if (isDestroyed) {
          /* 게임 오버 */
          alert("게임 오버. 스파르타 본부를 지키지 못했다...ㅠㅠ");
          //UserSocket.GetInstance().SendEvent(3, { score: this.score });
          location.reload();
        }
        monster.draw(this.ctx);
      } else {
        /* 몬스터가 죽었을 때 */
        this.monsters.splice(i, 1);
        this.userGold += 100;
      }
    }
    requestAnimationFrame(() => {
      this.GameLoop();
    });
  }
}
export default GameClient;

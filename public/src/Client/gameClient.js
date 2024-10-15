import UserSocket from "../Network/userSocket.js";
import pathManager from "../path.js";
import { Inhibitor } from "../base.js";
import Player from "../player.js";

class GameClient {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.player = new Player(this.ctx, 60, 60); // 플레이어
    this.userGold = 0; // 유저 돈
    this.inhibitor = null; // 억제기
    this.inhibitorHp = 0; // 억제기 생성시 최대 체력
    this.towerCost = 0; // 타워 구입시 가격
    this.numOfInitialTowers = 0; // 게임 시작시 타워 자동 생성 -> 없어도 됨
    this.monsters = []; // 몬스터 저장 배열
    this.towers = []; // 타워 저장 배열
    this.score = 0; // 현재 플레이어의 스코어
    this.highScore = 0; // 현재 서버 최고 스코어
    this.backgroundImage = null; // 배경 이미지
    this.healTowerImage = null; //힐 타워 이미지
    this.singletowerImage = null; // 단일공격 타워 이미지
    this.multiAttackTowerImage = null; // 범위공격 타워 이미지
    this.inhibitorImage = null; // 억제기 이미지
    this.brokenInhibitorImage = null; // 부서진 억제기 이미지
    this.pathImage = null; // 경로 이미지
    this.monsterImages = []; // 몬스터 이미지
    this.specialMonsterImages = []; // 억제기 특수 몬스터 이미지
    this.NUM_OF_MONSTERS = 5;
    this.monsterPath = null; // 몬스터가 지나가는 경로
    this.path = null; // 경로
    this.audioVolume = 4; // 배경 오디오 소리 크기
    this.effectVolume = 4; // 효과음 소리 크기
    this.audio = null;

    this.buySingleTowerButton = document.createElement("button");
    this.buySingleTowerButton.textContent = "원거리 타워 구입";
    this.buySingleTowerButton.style.position = "absolute";
    this.buySingleTowerButton.style.top = "10px";
    this.buySingleTowerButton.style.right = "10px";
    this.buySingleTowerButton.style.padding = "10px 20px";
    this.buySingleTowerButton.style.fontSize = "16px";
    this.buySingleTowerButton.style.cursor = "pointer";
    document.body.appendChild(this.buySingleTowerButton);
    this.buySingleTowerButton.addEventListener("click", () => {
      UserSocket.getInstance().SendEvent(9, {
        towerId: 1,
        timeStamp: Date.now(),
      });
    });

    this.buyRangeTowerButton = document.createElement("button");
    this.buyRangeTowerButton.textContent = "화염 타워 구입";
    this.buyRangeTowerButton.style.position = "absolute";
    this.buyRangeTowerButton.style.top = "60px";
    this.buyRangeTowerButton.style.right = "10px";
    this.buyRangeTowerButton.style.padding = "10px 20px";
    this.buyRangeTowerButton.style.fontSize = "16px";
    this.buyRangeTowerButton.style.cursor = "pointer";
    document.body.appendChild(this.buyRangeTowerButton);
    this.buyRangeTowerButton.addEventListener("click", () => {
      UserSocket.getInstance().SendEvent(9, {
        towerId: 2,
        timeStamp: Date.now(),
      });
    });

    this.buyHealTowerButton = document.createElement("button");
    this.buyHealTowerButton.textContent = "치유 타워 구입";
    this.buyHealTowerButton.style.position = "absolute";
    this.buyHealTowerButton.style.top = "110px";
    this.buyHealTowerButton.style.right = "10px";
    this.buyHealTowerButton.style.padding = "10px 20px";
    this.buyHealTowerButton.style.fontSize = "16px";
    this.buyHealTowerButton.style.cursor = "pointer";
    document.body.appendChild(this.buyHealTowerButton);
    this.buyHealTowerButton.addEventListener("click", () => {
      UserSocket.getInstance().SendEvent(9, {
        towerId: 3,
        timeStamp: Date.now(),
      });
    });

    this.volumeUpeBtuuon = document.createElement("button");
    this.volumeUpeBtuuon.textContent = "배경 소리 +5";
    this.volumeUpeBtuuon.style.position = "absolute";
    this.volumeUpeBtuuon.style.top = "200px";
    this.volumeUpeBtuuon.style.right = "10px";
    this.volumeUpeBtuuon.style.padding = "10px 20px";
    this.volumeUpeBtuuon.style.fontSize = "16px";
    this.volumeUpeBtuuon.style.cursor = "pointer";
    document.body.appendChild(this.volumeUpeBtuuon);
    this.volumeUpeBtuuon.addEventListener("click", () => {
      if (this.audioVolume < 20) {
        this.audioVolume++;
        this.audio.volume = 0.05 * this.audioVolume;
        this.showVolume.textContent = "배경 음악: " + this.audioVolume * 5;
      }
    });

    this.volumeDowneBtuuon = document.createElement("button");
    this.volumeDowneBtuuon.textContent = "배경 소리 -5";
    this.volumeDowneBtuuon.style.position = "absolute";
    this.volumeDowneBtuuon.style.top = "250px";
    this.volumeDowneBtuuon.style.right = "10px";
    this.volumeDowneBtuuon.style.padding = "10px 20px";
    this.volumeDowneBtuuon.style.fontSize = "16px";
    this.volumeDowneBtuuon.style.cursor = "pointer";
    document.body.appendChild(this.volumeDowneBtuuon);
    this.volumeDowneBtuuon.addEventListener("click", () => {
      if (this.audioVolume > 0) {
        this.audioVolume--;
        this.audio.volume = 0.05 * this.audioVolume;
        this.showVolume.textContent = "배경 음악: " + this.audioVolume * 5;
      }
    });

    this.showVolume = document.createElement("button");
    this.showVolume.textContent = "배경 음악: " + this.audioVolume * 5;
    this.showVolume.style.position = "absolute";
    this.showVolume.style.top = "300px";
    this.showVolume.style.right = "10px";
    this.showVolume.style.padding = "10px 20px";
    this.showVolume.style.fontSize = "16px";
    document.body.appendChild(this.showVolume);

    this.effectVolumeUpBtuuon = document.createElement("button");
    this.effectVolumeUpBtuuon.textContent = "효과음 +5";
    this.effectVolumeUpBtuuon.style.position = "absolute";
    this.effectVolumeUpBtuuon.style.top = "380px";
    this.effectVolumeUpBtuuon.style.right = "10px";
    this.effectVolumeUpBtuuon.style.padding = "10px 20px";
    this.effectVolumeUpBtuuon.style.fontSize = "16px";
    this.effectVolumeUpBtuuon.style.cursor = "pointer";
    document.body.appendChild(this.effectVolumeUpBtuuon);
    this.effectVolumeUpBtuuon.addEventListener("click", () => {
      if (this.effectVolume < 20) {
        this.effectVolume++;
        this.showEffectVolume.textContent = "효과음: " + this.effectVolume * 5;
      }
    });

    this.effectVolumeDownBtuuon = document.createElement("button");
    this.effectVolumeDownBtuuon.textContent = "효과음 -5";
    this.effectVolumeDownBtuuon.style.position = "absolute";
    this.effectVolumeDownBtuuon.style.top = "430px";
    this.effectVolumeDownBtuuon.style.right = "10px";
    this.effectVolumeDownBtuuon.style.padding = "10px 20px";
    this.effectVolumeDownBtuuon.style.fontSize = "16px";
    this.effectVolumeDownBtuuon.style.cursor = "pointer";
    document.body.appendChild(this.effectVolumeDownBtuuon);
    this.effectVolumeDownBtuuon.addEventListener("click", () => {
      if (this.effectVolume > 0) {
        this.effectVolume--;
        this.showEffectVolume.textContent = "효과음: " + this.effectVolume * 5;
      }
    });

    this.showEffectVolume = document.createElement("button");
    this.showEffectVolume.textContent = "효과음: " + this.effectVolume * 5;
    this.showEffectVolume.style.position = "absolute";
    this.showEffectVolume.style.top = "480px";
    this.showEffectVolume.style.right = "10px";
    this.showEffectVolume.style.padding = "10px 20px";
    this.showEffectVolume.style.fontSize = "16px";
    document.body.appendChild(this.showEffectVolume);
  }
  static getInstance() {
    if (!this.gInstance) {
      this.gInstance = new GameClient();
    }
    return this.gInstance;
  }
  setStageInfo(stages) {
    this.stages = stages;
    this.userGold = stages.gold;
  }

  placeinhibitor() {
    const lastPoint = this.monsterPath[this.monsterPath.length - 1];
    this.inhibitor = new Inhibitor(lastPoint.x, lastPoint.y, this.inhibitorHp);
  }

  loadGameImages(infos) {
    this.backgroundImage = infos.backgroundImage;
    this.healTowerImage = infos.healTowerImage;
    this.singletowerImage = infos.singletowerImage;
    this.multiAttackTowerImage = infos.multiAttackTowerImage;
    this.inhibitorImage = infos.inhibitorImage;
    this.brokenInhibitorImage = infos.brokenInhibitorImage;
    this.pathImage = infos.pathImage;
    this.monsterImages = infos.monsterImages;
    this.specialMonsterImages = infos.specialMonsterImages;
    this.ctx.drawImage(
      this.backgroundImage,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }
  gameStart(stages, highScore) {
    const audio = new Audio("../../sounds/bgm.mp3");
    audio.play();
    audio.loop = true; // 반복재생
    audio.volume = 0.35; // 음량 설정
    this.audio = audio;
    this.stages = stages;
    this.userGold += stages.gold;
    this.inhibitorHp = stages.inhibitorHp;
    this.highScore = highScore ? highScore : this.highScore;
    this.path = new pathManager(this.canvas, this.ctx, this.pathImage, 60, 60);
    this.monsterPath = this.path.generateRandomMonsterPath();
    this.path.drawPath(this.monsterPath);
    this.placeinhibitor();
    this.gameLoop();
  }
  async gameLoop() {
    this.ctx.drawImage(
      this.backgroundImage,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    this.path.drawPath(this.monsterPath);
    this.player.draw();
    this.player.move();

    this.inhibitor.draw(
      this.ctx,
      this.inhibitorImage,
      this.brokenInhibitorImage
    );

    this.ctx.font = "25px Times New Roman";
    this.ctx.fillStyle = "skyblue";
    this.ctx.fillText(`최고 기록: ${this.highScore}`, 100, 50); // 최고 기록 표시
    this.ctx.fillStyle = "white";
    this.ctx.fillText(`점수: ${this.score}`, 100, 100); // 현재 스코어 표시
    this.ctx.fillStyle = "yellow";
    this.ctx.fillText(`골드: ${this.userGold}`, 100, 150); // 골드 표시
    this.ctx.fillStyle = "red";
    this.ctx.fillText(`몬스터 수: ${this.monsters.length}`, 100, 250); // 몬스터수 표시
    if (this.stages) {
      this.ctx.fillStyle = "green";
      this.ctx.fillText(`현재 스테이지: ${this.stages.stageId}`, 100, 200); // 현재 스테이지 표시
    }

    this.towers.forEach((tower) => {
      tower.draw(
        this.ctx,
        this.singletowerImage,
        this.multiAttackTowerImage,
        this.healTowerImage
      );
      tower.singleAttack(this.monsters); // 단일 공격
      tower.multiAttack(this.monsters); // 다중 공격
      tower.heal(this.inhibitor); // 힐
    });
    this.inhibitor.draw(
      this.ctx,
      this.inhibitorImage,
      this.brokenInhibitorImage
    );
    for (let i = this.monsters.length - 1; i >= 0; i--) {
      const monster = this.monsters[i];
      /* 몬스터 삭제 */
      if (monster.hp <= 0) {
        this.monsters.splice(i, 1);
      }

      /* 몬스터 이동 */
      monster.move(this.inhibitor);
      monster.draw(this.ctx);
    }
    requestAnimationFrame(() => {
      this.gameLoop();
    });
  }
}
export default GameClient;

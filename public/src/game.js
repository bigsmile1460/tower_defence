import { Base } from "./base.js";
import { Monster } from "./monster.js";

import UserSocket from "./Network/userSocket.js";
import pathManager from "./path.js";
import Player from "./player.js";
import { Tower } from "./tower.js";

let serverSocket;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = new Player(ctx, 60, 60);

const NUM_OF_MONSTERS = 5; // 몬스터 개수

let userGold = 0; // 유저 골드
let base; // 기지 객체
let baseHp = 0; // 기지 체력

let stageChange = true;
let towerCost = 0; // 타워 구입 비용
let numOfInitialTowers = 0; // 초기 타워 개수
let monsterLevel = 1; // 몬스터 레벨
let monsterSpawnInterval = 1000; // 몬스터 생성 주기
const monsters = [];
const towers = [];

let score = 0; // 게임 점수
let highScore = 0; // 기존 최고 점수
let isInitGame = false;

// 이미지 로딩 파트
const backgroundImage = new Image();
backgroundImage.src = "images/bg.webp";

const towerImage = new Image();
towerImage.src = "images/tower.png";

const baseImage = new Image();
baseImage.src = "images/base.png";

const pathImage = new Image();
pathImage.src = "images/path.png";

const monsterImages = [];
for (let i = 1; i <= NUM_OF_MONSTERS; i++) {
  const img = new Image();
  img.src = `images/monster${i}.png`;
  monsterImages.push(img);
}

// 경로 생성 클래스
const path = new pathManager(canvas, ctx, pathImage, 60, 60);

const userSocketSave = UserSocket.GetInstance();

let monsterPath;
// 클라이언트 - 서버 요청 코드들

// 이미지 로딩 완료 후 서버와 연결하고 게임 초기화
await Promise.all([
  new Promise((resolve) => (backgroundImage.onload = resolve)),
  new Promise((resolve) => (towerImage.onload = resolve)),
  new Promise((resolve) => (baseImage.onload = resolve)),
  new Promise((resolve) => (pathImage.onload = resolve)),
  ...monsterImages.map(
    (img) => new Promise((resolve) => (img.onload = resolve))
  ),
]).then(() => {
  userSocketSave.Connect();
  userSocketSave.SendEvent(1, {});

  if (!isInitGame) {
    initGame();
  }
});

function initMap() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 배경 이미지 그리기
  path.drawPath(monsterPath);
}

function placeInitialTowers() {
  /* 
    타워를 초기에 배치하는 함수입니다.
    무언가 빠진 코드가 있는 것 같지 않나요? 
  */
  for (let i = 0; i < numOfInitialTowers; i++) {
    const { x, y } = path.getRandomPositionNearPath(200, monsterPath);
    const tower = new Tower(x, y, towerCost);
    towers.push(tower);
    tower.draw(ctx, towerImage);
  }
}

function placeNewTower() {
  /* 
    타워를 구입할 수 있는 자원이 있을 때 타워 구입 후 랜덤 배치하면 됩니다.
    빠진 코드들을 채워넣어주세요! 
  */
  const { x, y } = path.getRandomPositionNearPath(200, monsterPath);
  const tower = new Tower(x, y);
  towers.push(tower);
  tower.draw(ctx, towerImage);
}

function placeBase() {
  const lastPoint = monsterPath[monsterPath.length - 1];
  base = new Base(lastPoint.x, lastPoint.y, baseHp);
  base.draw(ctx, baseImage);
}

function spawnMonster() {
  monsters.push(new Monster(monsterPath, monsterImages, monsterLevel));
}

async function gameLoop() {
  // 렌더링 시에는 항상 배경 이미지부터 그려야 합니다! 그래야 다른 이미지들이 배경 이미지 위에 그려져요!
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 배경 이미지 다시 그리기
  path.drawPath(monsterPath); // 경로 다시 그리기
  player.draw();

  // 현재 스테이지가 마지막 스테이지인지
  if (
    userSocketSave.stages[userSocketSave.stages.length - 1].id ===
    userSocketSave.currentStage.id
  ) {
    stageChange = false;
  }

  // 현재 몬스터의 수가 많거나 마지막 스테이지인 경우
  if (
    monsters.length >= 200 &&
    !stageChange &&
    score >=
      userSocketSave.stages[userSocketSave.stages.length - 1].requireScore
  ) {
    userSocketSave.SendEvent(3, { HighScore: score });
    location.reload();
  }

  // 현재 스테이지에서 다음 스테이지로 넘어가는 요구사항에 만족시
  if (score >= userSocketSave.currentStage.requireScore && stageChange) {
    userSocketSave.SendEvent(2, {
      //userGold: userGold,
      currentStage: userSocketSave.currentStage,
    });
  }

  ctx.font = "25px Times New Roman";
  ctx.fillStyle = "skyblue";
  ctx.fillText(`최고 기록: ${highScore}`, 100, 50); // 최고 기록 표시
  ctx.fillStyle = "white";
  ctx.fillText(`점수: ${score}`, 100, 100); // 현재 스코어 표시
  ctx.fillStyle = "yellow";
  ctx.fillText(`골드: ${userGold}`, 100, 150); // 골드 표시

  ctx.fillStyle = "red";
  ctx.fillText(`현재 스테이지: ${+userSocketSave.currentStage.id}`, 100, 200); // 현재 스테이지 표시

  // 타워 그리기 및 몬스터 공격 처리
  towers.forEach((tower) => {
    tower.draw(ctx, towerImage);
    tower.updateCooldown();
    //tower.singleAttack(tower, monsters, serverSocket); // 단일 공격
    //tower.multiAttack(tower, monsters, serverSocket); // 다중 공격
    //tower.heal(tower, base, serverSocket); // 힐
  });

  // 몬스터가 공격을 했을 수 있으므로 기지 다시 그리기
  base.draw(ctx, baseImage);

  for (let i = monsters.length - 1; i >= 0; i--) {
    const monster = monsters[i];
    if (monster.hp > 0) {
      const isDestroyed = monster.move(base);
      if (isDestroyed) {
        /* 게임 오버 */
        alert("게임 오버. 스파르타 본부를 지키지 못했다...ㅠㅠ");
        location.reload();
      }
      monster.draw(ctx);
    } else {
      /* 몬스터가 죽었을 때 */
      monsters.splice(i, 1);
    }
  }

  requestAnimationFrame(gameLoop); // 지속적으로 다음 프레임에 gameLoop 함수 호출할 수 있도록 함
}

function initGame() {
  if (isInitGame) {
    return;
  }

  monsterPath = path.generateRandomMonsterPath(); // 몬스터 경로 생성
  initMap(); // 맵 초기화 (배경, 몬스터 경로 그리기)
  placeInitialTowers(); // 설정된 초기 타워 개수만큼 사전에 타워 배치
  placeBase(); // 기지 배치

  setInterval(spawnMonster, monsterSpawnInterval); // 설정된 몬스터 생성 주기마다 몬스터 생성

  // 지금 게임 시작 전에 데이터를 불러오는게 제대로 안되는 중
  setTimeout(() => {
    userGold = userSocketSave.initGameDB.startGold;
    baseHp = userSocketSave.initGameDB.baseHp;
    highScore = userSocketSave.initGameDB.serverHighScore;

    gameLoop(); // 게임 루프 최초 실행
  }, 1000);

  isInitGame = true;
}

const buyTowerButton = document.createElement("button");
buyTowerButton.textContent = "타워 구입";
buyTowerButton.style.position = "absolute";
buyTowerButton.style.top = "10px";
buyTowerButton.style.right = "10px";
buyTowerButton.style.padding = "10px 20px";
buyTowerButton.style.fontSize = "16px";
buyTowerButton.style.cursor = "pointer";

buyTowerButton.addEventListener("click", placeNewTower);

document.body.appendChild(buyTowerButton);

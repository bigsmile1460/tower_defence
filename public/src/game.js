import { Inhibitor } from "./base.js";
import { clearLocalStorage, getLocalStorage } from "./Local/localStorage.js";
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
let inhibitor; // 기지 객체
let inhibitorHp = 100; // 기지 체력

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

const inhibitorImage = new Image();
inhibitorImage.src = "images/base.png";

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

let startTime = 0;
let elapsedTime = 0;

let stageChange = true;

let monsterPath;
// 클라이언트 - 서버 요청 코드들

// 이미지 로딩 완료 후 서버와 연결하고 게임 초기화
await Promise.all([
  new Promise((resolve) => (backgroundImage.onload = resolve)),
  new Promise((resolve) => (towerImage.onload = resolve)),
  new Promise((resolve) => (inhibitorImage.onload = resolve)),
  new Promise((resolve) => (pathImage.onload = resolve)),
  ...monsterImages.map(
    (img) => new Promise((resolve) => (img.onload = resolve))
  ),
]).then(() => {
  //시작시 로컬 스토리지 초기화 , 시작 시간 지정
  clearLocalStorage();
  startTime = Date.now();
  elapsedTime = startTime;

  userSocketSave.Connect();
  userSocketSave.SendEvent(1, {}); // 서버에 게임 시작 이벤트 보냄

  if (!isInitGame) {
    initGame();
  }
});

function initMap() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 배경 이미지 그리기
  path.drawPath(monsterPath);
}

function placeInitialTowers() {
  for (let i = 0; i < numOfInitialTowers; i++) {
    const { x, y } = path.getRandomPositionNearPath(200, monsterPath);
    const tower = new Tower(x, y, towerCost);
    towers.push(tower);
    tower.draw(ctx, towerImage);
  }
}

function placeNewTower() {
  const tower = new Tower(player.x, player.y);
  towers.push(tower);
  tower.draw(ctx, towerImage);
}

function placeinhibitor() {
  const lastPoint = monsterPath[monsterPath.length - 1];
  inhibitor = new Inhibitor(lastPoint.x, lastPoint.y, inhibitorHp);
  inhibitor.draw(ctx, inhibitorImage);
}

function spawnMonster() {
  monsters.push(new Monster(monsterPath, monsterImages, monsterLevel));
}

async function gameLoop() {
  // 렌더링 시에는 항상 배경 이미지부터 그려야 합니다! 그래야 다른 이미지들이 배경 이미지 위에 그려져요!
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 배경 이미지 다시 그리기
  path.drawPath(monsterPath); // 경로 다시 그리기
  player.draw();

  //경과 시간

  elapsedTime++;

  // 현재 스테이지가 마지막 스테이지인지
  if (
    getLocalStorage("stages")[getLocalStorage("stages").length - 1].id ===
    getLocalStorage("currentStage").id
  ) {
    stageChange = false;
  }

  // 시작 시간과 종료시간을 비교하여 500(실제로 1초?) 정도 차이가 나면 스테이지 변경 처리
  if ((elapsedTime - startTime) % 500 === 0 && stageChange) {
    userGold += getLocalStorage("currentStage").clearGold;
    score += getLocalStorage("currentStage").Score;
    userSocketSave.SendEvent(2, {
      currentStage: getLocalStorage("currentStage"),
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
  ctx.fillText(
    `현재 스테이지: ${getLocalStorage("currentStage").id}`,
    100,
    200
  ); // 현재 스테이지 표시

  // 타워 그리기 및 몬스터 공격 처리
  towers.forEach((tower) => {
    tower.draw(ctx, towerImage);
    tower.updateCooldown();
    tower.singleAttack(tower, monsters); // 단일 공격
    tower.multiAttack(tower, monsters); // 다중 공격
    tower.heal(tower, inhibitor); // 힐
  });

  // 몬스터가 공격을 했을 수 있으므로 기지 다시 그리기
  inhibitor.draw(ctx, inhibitorImage);

  for (let i = monsters.length - 1; i >= 0; i--) {
    const monster = monsters[i];
    if (monster.hp > 0) {
      const isDestroyed = monster.move(inhibitor);
      if (isDestroyed) {
        /* 게임 오버 */
        alert("게임 오버. 스파르타 본부를 지키지 못했다...ㅠㅠ");
        location.reload();
      }
      monster.draw(ctx);
    } else {
      /* 몬스터가 죽었을 때 */
      monsters.splice(i, 1);
      score += 100; // 몬스터가 죽었을때 점수가 오르도록 간단한 처리
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
  placeinhibitor(); // 기지 배치

  setInterval(spawnMonster, monsterSpawnInterval); // 설정된 몬스터 생성 주기마다 몬스터 생성

  setTimeout(() => {
    const { startGold, baseHp, serverHighScore } =
      getLocalStorage("initGameDB");
    userGold = startGold;
    inhibitorHp = baseHp;
    highScore = serverHighScore;
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

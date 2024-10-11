import Game from "../src/Client/Game.js";
import { Inhibitor } from "./base.js";
import { getLocalStorage } from "./Local/localStorage.js";
import UserSocket from "./Network/userSocket.js";

let game = new Game();

const NUM_OF_MONSTERS = 5;
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

GameStart();

async function GameStart() {
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
    UserSocket.GetInstance().Connect();
    UserSocket.GetInstance().SendEvent(1, {});

    game.GameStart({
      backgroundImage: backgroundImage,
      towerImage: towerImage,
      inhibitorImage: inhibitorImage,
      pathImage: pathImage,
      monsterImages: monsterImages,
      userGold: getLocalStorage("initGameDB").startGold, // 시작시 유저 골드
      inhibitorHp: getLocalStorage("initGameDB").baseHp, // 시작시 기지 체력
      highScore: getLocalStorage("initGameDB").serverHighScore, // 시작시 서버 최고 점수
      startTime: Date.now(), // 현재 시간
      elpsedTime: Date.now(), // 변경 시간
    });

    // 몬스터 생성 주기
    setInterval(() => {
      game.SpawnMonster();
    }, game.monsterSpawnInterval);

    game.GameLoop();
  });
}
<<<<<<< HEAD

function initGame() {
  if (isInitGame) {
    return;
  }

  monsterPath = path.generateRandomMonsterPath(); // 몬스터 경로 생성
  initMap(); // 맵 초기화 (배경, 몬스터 경로 그리기)
  placeInitialTowers(); // 설정된 초기 타워 개수만큼 사전에 타워 배치
  placeinhibitor(); // 기지 배치

  //몬스터 스폰 이벤트
  console.log("스폰 이벤트 ")
  const result = userSocketSave.SendEvent(6,userSocketSave.stages)
  console.log("result: ", result)

  setInterval(() => {
    spawnMonster()
  }, monsterSpawnInterval);
  // setInterval(spawnMonster, monsterSpawnInterval); // 설정된 몬스터 생성 주기마다 몬스터 생성

  // 지금 게임 시작 전에 데이터를 불러오는게 제대로 안되는 중
  setTimeout(() => {
    userGold = userSocketSave.initGameDB.startGold;
    inhibitorHp = userSocketSave.initGameDB.inhibitorHp;
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
=======
>>>>>>> 44b687fa500fdba325b1030eb0ae15159b98ab82

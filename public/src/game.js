import GameClient from "./Client/gameClient.js";
import UserSocket from "./Network/userSocket.js";
let gameClient = GameClient.getInstance();
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
gameStart();
async function gameStart() {
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
    UserSocket.getInstance().Connect();
    UserSocket.getInstance().SendEvent(1, {});
    gameClient.loadGameImages({
      backgroundImage: backgroundImage,
      towerImage: towerImage,
      inhibitorImage: inhibitorImage,
      pathImage: pathImage,
      monsterImages: monsterImages,
    });
  });
}

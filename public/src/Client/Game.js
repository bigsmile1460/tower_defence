import UserSocket from "../Network/userSocket.js";
import { Tower } from "../tower.js";
import pathManager from "../path.js";
import { Monster } from "../monster.js";
import { Base } from "../base.js";
import Player from "../player.js";

class Game {
    constructor() {
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");

        this.player = new Player(this.ctx, 60, 60);
        this.userGold = 0;
        this.base = 0;
        this.baseHP = 0;
        
        this.towerCost = 0;
        this.numOfInitialTowers = 0;
        this.monsterLevel = 1;
        this.monsterSpawnInterval = 1000;

        this.monsters = [];
        this.towers = [];

        this.score = 0;
        this.highScore = 0;        

        this.backgroundImage = null;
        this.towerImage = null;
        this.baseImage = null;
        this.pathImage = null;
        this.monsterImages = [];

        this.NUM_OF_MONSTERS = 5;

        this.monsterPath = null;

        this.path = null;
        this.monsterPath = null;

        this.buyTowerButton = document.createElement("button");
        this.buyTowerButton.textContent = "타워 구입";
        this.buyTowerButton.style.position = "absolute";
        this.buyTowerButton.style.top = "10px";
        this.buyTowerButton.style.right = "10px";
        this.buyTowerButton.style.padding = "10px 20px";
        this.buyTowerButton.style.fontSize = "16px";
        this.buyTowerButton.style.cursor = "pointer";  

        this.buyTowerButton.addEventListener("click", () => {          
            const newTower = new Tower(this.player.x, this.player.y);
            this.towers.push(newTower);

            console.log(this.towers);
        });

        document.body.appendChild(this.buyTowerButton);        
    }

    InitMap() {
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        this.path.drawPath(this.monsterPath);
    }

    InitGame() {
        this.monsterPath = this.path.generateRandomMonsterPath();
        this.InitMap();
        this.PlaceInitialTowers();
        this.PlaceBase();        
    }

    PlaceInitialTowers() {
        for (let i = 0; i < this.numOfInitialTowers; i++) {
            const { x, y } = this.path.getRandomPositionNearPath(200, this.monsterPath);
            const tower = new Tower(x, y, this.towerCost);
            this.towers.push(tower);
            tower.draw(this.ctx, this.towerImage);
        }
    }

    PlaceBase() {
        const lastPoint = this.monsterPath[this.monsterPath.length - 1];
        this.base = new Base(lastPoint.x, lastPoint.y, this.baseHP);
        this.base.draw(this.ctx, this.baseImage);
    }    
    
    SpawnMonster() {
        this.monsters.push(new Monster(this.monsterPath, this.monsterImages, this.monsterLevel));
    }

    GameStart(images) {
        this.backgroundImage = images.backgroundImage;
        this.towerImage = images.towerImage;
        this.baseImage = images.baseImage;
        this.pathImage = images.pathImage;

        this.monsterImages = images.monsterImages;

        this.path = new pathManager(this.canvas, this.ctx, this.pathImage, 60, 60);

        this.InitGame();
    }

    async GameLoop() {       

        this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);

        this.path.drawPath(this.monsterPath);
        this.player.draw();

        this.ctx.font = "25px Times New Roman";
        this.ctx.fillStyle = "skyblue";
        this.ctx.fillText(`최고 기록: ${this.highScore}`, 100, 50); // 최고 기록 표시
        this.ctx.fillStyle = "white";
        this.ctx.fillText(`점수: ${this.score}`, 100, 100); // 현재 스코어 표시
        this.ctx.fillStyle = "yellow";
        this.ctx.fillText(`골드: ${this.userGold}`, 100, 150); // 골드 표시

        this.ctx.fillStyle = "red";
        this.ctx.fillText(`현재 스테이지: 0`, 100, 200); // 현재 스테이지 표시

        this.towers.forEach((tower) => {
            tower.draw(this.ctx, this.towerImage);
            tower.updateCooldown();
        });

        this.base.draw(this.ctx, this.baseImage);

        for (let i = this.monsters.length - 1; i >= 0; i--) {
            const monster = this.monsters[i];
            if (monster.hp > 0) {
                const isDestroyed = monster.move(this.base);
                if (isDestroyed) {
                    /* 게임 오버 */
                    alert("게임 오버. 스파르타 본부를 지키지 못했다...ㅠㅠ");
                    location.reload();
                }
                monster.draw(this.ctx);
            } else {
                /* 몬스터가 죽었을 때 */
                this.monsters.splice(i, 1);
            }
        }

        requestAnimationFrame(() => {
            this.GameLoop();
        })
    }
}

export default Game;
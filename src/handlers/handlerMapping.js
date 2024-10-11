import { towerAttack } from "../tower/towerAttack.js";
import { gameStart, stageChange, gameEnd } from "../handlers/stage.handler.js";
import { spawnNormal } from "./spawnNormal.handler.js";
import { towerBuy } from "./towerBuy.handler.js";
const handlerMapping = {
  1: gameStart,
  2: stageChange,
  3: gameEnd,
  //   4: monsterDie,
  //   5: spawnSpecial,
  6: spawnNormal,
  7: towerAttack,
  //   8: towerUpgrade,
  9: towerBuy,
  //   10: towerSell,
};

export default handlerMapping;

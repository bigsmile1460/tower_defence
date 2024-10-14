import { towerAttack } from "./tower/towerAttack.js";
import { stageStart } from "./stage/stage.handler.js";
import { spawnNormal } from "./monster/spawnNormal.js";
import { towerBuy } from "./tower/towerBuy.handler.js";
import { towerUpgrade } from "./tower/towerUpgrade.js";
import { towerSell } from "./tower/towerSell.js";
import { monsterAttack } from "./monster/monsterAttack.js";

const handlerMapping = {
  1: stageStart,
  // 2: stageChange,
  // 3: stageEnd,
  //   4: monsterDie,
  //   5: spawnSpecial,
  6: monsterAttack,
  7: towerAttack,
  8: towerUpgrade,
  9: towerBuy,
  10: towerSell,
};

export default handlerMapping;

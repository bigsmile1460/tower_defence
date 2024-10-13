import { towerBuy } from "./towers/buyTower.js";
import { towerSell } from "./towers/sellTower.js";
import { towerUpgrade } from "./towers/upgradeTower.js";
import { stageStart } from "./stages/stageStart.js";
import { stageChange } from "./stages/stageChange.js";

const handlerMapping = {
  1: stageStart,
  2: stageChange,
  // 4: monsterDie,
  // 5: spawnSpecial,
  // 6: spawnNormal,
  8: towerUpgrade,
  9: towerBuy,
  10: towerSell,
};

export default handlerMapping;

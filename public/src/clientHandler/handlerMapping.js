import { towerBuy } from "./towers/buyTower.js";
import { towerSell } from "./towers/sellTower.js";
import { towerUpgrade } from "./towers/upgradeTower.js";
import { stageStart } from "./stages/stageStart.js";
import { stageChange } from "./stages/stageChange.js";
import { stageEnd } from "./stages/stageEnd.js";
import { spawnNormal } from "./monsters/spawnNormal.js";
import { monsterDie } from "./monsters/dieMonster.js";
import { monsterAttack } from "./monsters/monsterAttack.js";
import { inhibitorStatusUpdate } from "./inhibitor/inhibitorStatus.js";

const handlerMapping = {
  1: stageStart,
  2: stageChange,
  3: stageEnd,
  4: monsterDie,
  // 5: spawnSpecial,
  6: spawnNormal,
  8: towerUpgrade,
  9: towerBuy,
  10: towerSell,
  11: monsterAttack,
  12: inhibitorStatusUpdate,
};

export default handlerMapping;

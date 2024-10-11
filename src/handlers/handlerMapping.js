import { towerAttack } from "./tower/towerAttack.js";
import { stageChange, stageEnd, stageStart } from "./stage/stage.handler.js";
import { spawnNormal } from "./monster/spawnNormal.js";

const handlerMapping = {
  1: stageStart,
  2: stageChange,
  3: stageEnd,
  //   4: monsterDie,
  //   5: spawnSpecial,
  6: spawnNormal,
  7: towerAttack,
  //   8: towerUpgrade,
  //   9: towerBuy,
  //   10: towerSell,
};

export default handlerMapping;

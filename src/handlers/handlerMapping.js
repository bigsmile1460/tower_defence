import { gameStart, towerAttack } from "../tower/towerAttack.js";

const handlerMapping = {
  1: gameStart,
  //   2: stageChange,
  //   3: stageEnd,
  //   4: monsterDie,
  //   5: spawnSpecial,
  //   6: spawnNormal,
  7: towerAttack,
  //   8: towerUpgrade,
  //   9: towerBuy,
  //   10: towerSell,
};

export default handlerMapping;

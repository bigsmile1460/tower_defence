import GameClient from "../../Client/gameClient.js";

export const towerUpgrade = (payload) => {
  let tower = GameClient.GetInstance().towers.find((x) => x.id === payload);
  tower.attackPower += tower.upgradeAttackPower;
  tower.towerPrice += tower.upgradePrice;
  tower.level += 1;

  GameClient.GetInstance().userGold -= tower.upgradePrice;
};

import GameClient from "../../Client/gameClient.js";

export const towerUpgrade = (payload) => {
  let tower = GameClient.getInstance().towers.find((x) => x.id === payload);
  tower.attackPower += tower.upgradeAttackPower;
  tower.towerPrice += tower.upgradePrice;
  tower.level += 1;

  GameClient.getInstance().userGold -= tower.upgradePrice;
};

import GameClient from "../../Client/gameClient.js";

export const towerUpgrade = (payload) => {
  let tower = GameClient.GetInstance().towers.find((x) => x.id === payload);
  tower.attackPower += tower.upgradeAttackPower;
  GameClient.GetInstance().userGold -= tower.towerPrice;
};

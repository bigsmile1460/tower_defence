import GameClient from "../../Client/gameClient.js";

export const towerSell = (payload) => {
  const towerIndex = GameClient.GetInstance().towers.findIndex(
    (tower) => tower.id === payload
  );
  const sellTower = GameClient.GetInstance().towers[towerIndex];
  const sellPrcie = sellTower.towerPrice * sellTower.sellPriceRate;
  GameClient.GetInstance().towers[towerIndex].upgradeButton.remove();
  GameClient.GetInstance().towers[towerIndex].sellButton.remove();
  GameClient.GetInstance().towers.splice(towerIndex, 1);
  GameClient.GetInstance().userGold += sellPrcie;
};

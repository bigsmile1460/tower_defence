import GameClient from "../../Client/gameClient.js";

export const towerSell = (payload) => {
  const towerIndex = GameClient.getInstance().towers.findIndex(
    (tower) => tower.id === payload
  );
  const sellTower = GameClient.getInstance().towers[towerIndex];
  const sellPrcie = Math.ceil(sellTower.towerPrice * sellTower.sellPriceRate);
  GameClient.getInstance().towers[towerIndex].upgradeButton.remove();
  GameClient.getInstance().towers[towerIndex].sellButton.remove();
  GameClient.getInstance().towers.splice(towerIndex, 1);
  GameClient.getInstance().userGold += sellPrcie;
  const audio = new Audio("../../../sounds/buy.mp3");
  audio.play();
  audio.loop = false; // 반복재생안함
  audio.volume = 0.1 * GameClient.getInstance().effectVolume; // 음량 설정
};

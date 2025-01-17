import GameClient from "../../Client/gameClient.js";

export const towerUpgrade = (payload) => {
  let tower = GameClient.getInstance().towers.find((x) => x.id === payload);
  GameClient.getInstance().userGold -= tower.upgradePrice;
  tower.attackPower += tower.upgradeAttackPower;
  tower.towerPrice += tower.upgradePrice;
  tower.upgradePrice += tower.upgradeAddPrice;
  tower.level += 1;

  const audio = new Audio("../../../sounds/towerUpgrade.mp3");
  audio.play();
  audio.loop = false; // 반복재생
  audio.volume = 0.05 * GameClient.getInstance().effectVolume; // 음량 설정
};

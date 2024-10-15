import GameClient from "../../Client/gameClient.js";

export const towerUpgrade = (payload) => {
  let tower = GameClient.getInstance().towers.find((x) => x.id === payload);
  tower.attackPower += tower.upgradeAttackPower;
  tower.towerPrice += tower.upgradePrice;
  tower.upgradePrice += tower.upgradeAddPrice;
  tower.level += 1;

  GameClient.getInstance().userGold -= tower.upgradePrice;
  const audio = new Audio("../../../sounds/towerUpgrade.mp3");
  audio.play();
  audio.loop = false; // 반복재생
  audio.volume = 0.2 + 0.04 * GameClient.getInstance().effectVolume; // 음량 설정
};

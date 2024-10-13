import GameClient from "../../Client/gameClient.js";
import { Tower } from "../../tower.js";

export const towerBuy = (payload) => {
  const tower = new Tower(
    GameClient.GetInstance().player.x,
    GameClient.GetInstance().player.y,
    payload.id,
    payload.towerData,
    payload.lastAttack
  );
  tower.buttonMake();
  GameClient.GetInstance().userGold -= tower.towerPrice;
  GameClient.GetInstance().towers.push(tower);
};

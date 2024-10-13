import GameClient from "../../Client/gameClient.js";
import { Tower } from "../../tower.js";

export const towerBuy = (payload) => {
  const tower = new Tower(
    GameClient.getInstance().player.x,
    GameClient.getInstance().player.y,
    payload.id,
    payload.towerData,
    payload.lastAttack
  );
  tower.buttonMake();
  GameClient.getInstance().userGold -= tower.towerPrice;
  GameClient.getInstance().towers.push(tower);
};

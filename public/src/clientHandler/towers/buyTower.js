import GameClient from "../../Client/gameClient.js";
import { Tower } from "../../tower.js";

export const towerBuy = (payload) => {
  const tower = new Tower(
    GameClient.player.x,
    GameClient.player.y,
    payload.id,
    payload.towerData,
    payload.lastAttack
  );
  GameClient.towers.push(tower);
};

import GameClient from "../../Client/gameClient";
import { Monster } from "../../monster.js";

export const spawnNormal = (payload) => {
  const monster = new Monster(
    GameClient.getInstance().monsterPath,
    GameClient.getInstance().monsterImages,
    payload.monsterData
  );
  
  GameClient.getInstance().monsters.push(monster);
};

import GameClient from "../../Client/gameClient.js";
import { Monster } from "../../monster.js";

export const spawnNormal = (payload) => {
  console.log("payload:",payload)
  const monster = new Monster(
    GameClient.getInstance().monsterPath,
    GameClient.getInstance().monsterImages,
    payload.monsterData
  );
  
  GameClient.getInstance().monsters.push(monster);
  console.log("monster:",GameClient.getInstance().monsters.length)
};

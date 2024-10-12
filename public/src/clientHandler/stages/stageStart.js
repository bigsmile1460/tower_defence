import GameClient from "../../Client/gameClient.js";

export const stageStart = (payload) => {
    GameClient.GetInstance().GameStart(payload.stage, payload.highScore);
};
  
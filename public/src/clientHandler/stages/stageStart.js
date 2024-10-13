import GameClient from "../../Client/gameClient.js";

export const stageStart = (payload) => {
    GameClient.getInstance().gameStart(payload.stage, payload.highScore);
};
  
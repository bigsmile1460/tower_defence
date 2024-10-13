import GameClient from "../../Client/gameClient.js";


export const stageChange = (payload) => {
    GameClient.getInstance().setStageInfo(payload.stage);
}
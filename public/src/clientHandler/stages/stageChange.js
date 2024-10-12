import GameClient from "../../Client/gameClient.js";


export const stageChange = (payload) => {
    GameClient.GetInstance().SetStageInfo(payload.stage);
}
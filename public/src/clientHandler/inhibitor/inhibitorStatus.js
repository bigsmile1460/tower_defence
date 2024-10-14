import GameClient from "../../Client/gameClient.js";

export const inhibitorStatusUpdate = (payload) => {
  GameClient.getInstance().inhibitor.status = payload.status;
  console.log(GameClient.getInstance().inhibitor.status);
};

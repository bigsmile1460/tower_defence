import GameClient from "../../Client/gameClient.js";

export const inhibitorBroken = (payload) => {
  console.log(payload);
  GameClient.getInstance().inhibitor.status = payload.status;
};

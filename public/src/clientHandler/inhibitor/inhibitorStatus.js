import GameClient from "../../Client/gameClient.js";

// 억제기 상태 업데이트
export const inhibitorStatusUpdate = (payload) => {
  GameClient.getInstance().inhibitor.status = payload.status;
  GameClient.getInstance().inhibitor.hp = payload.inhibitorHp;
};

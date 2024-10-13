import GameClient from "../../Client/gameClient.js";

// 바뀐 스테이지 정보 저장
export const stageChange = (payload) => {
  GameClient.getInstance().setStageInfo(payload.stageInfo);
};

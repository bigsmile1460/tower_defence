import { addtowerBuy } from "../Storages/tower.js";

export const towerBuy = async (io, socket, payload, userId) => {
  const towerInfo = await addtowerBuy(io, socket, payload, userId);

  if (towerInfo.towerPrice > payload.gold) {
    return { status: "fail", message: "골드가 부족 합니다" };
  }

  return { status: "succues", towerInfo: towerInfo };
};

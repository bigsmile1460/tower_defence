import { towerBuyCheck } from "../operator/towerBuyOperator.js";
import { addtowerBuy } from "../tower/towerFind.js";

export const towerBuy = async (io, socket, payload, userId) => {
  try {
    const towerInfo = await addtowerBuy(io, socket, payload, userId);

    towerBuyCheck(payload.gold, payload.price);

    const userGold = (payload.gold -= payload.price);
    console.log(userGold);
    return { status: "succues", towerInfo: towerInfo, userGold };
  } catch (error) {
    return { status: "fail", message: error };
  }
};

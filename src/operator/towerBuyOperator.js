export const towerBuyCheck = (payloadgold, payloadprice) => {
  if (payloadgold >= 0) {
    return { status: "fail", message: "보유중인 골드가 없습니다" };
  }

  if (payloadgold < payloadprice) {
    return { status: "fail", message: "골드가 부족합니다" };
  }
};

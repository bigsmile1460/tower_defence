// 골드 검사
export const towerBuyGoldCheck = async (towerId, userId) => {
  // 타워 데이터 가져오기
  const towerData = await prismaAsset.tower.findFirst({
    where: { id: towerId },
  });
  if (!towerData) {
    throw new Error(`존재 하지 않는 towerId 신청: ${towerId}`);
  }

  // stageStorage에서 골드 가저오기
  const gold = 1;
  if (!gold) {
    throw new Error(`플레이중이지 않은 userId 신청: ${userId}`);
  }

  // 골드 부족할 경우 return true
  if (gold < towerData.towerPrice) {
    return true;
  }

  // stageStorage에서 골드 차감오기 setGold(userId, gold - towerData.towerPrice)

  return false;
};

// 타워 생성
export const towerBuyMakeTower = async (towerId, timeStamp, userId, socket) => {
  // 타워 데이터 가져오기
  const towerData = await prismaAsset.tower.findFirst({
    where: { id: towerId },
  });
  if (!towerData) {
    throw new Error(`존재 하지 않는 towerId 신청: ${towerId}`);
  }

  // timeStamp 검증
  if (Date.now - timeStamp > 1000) {
    throw new Error(`서버 불안정 : ${(Date.now - timeStamp) / 1000}초`);
  }
  if (Date.now - timeStamp < 0) {
    throw new Error(`시간 조작: ${(Date.now - timeStamp) / 1000}초`);
  }

  // 벡엔드에 타워 생성
  const newTower = pushTower(userId, towerData, timeStamp);
  if (!newTower) {
    throw new Error(`플레이중이지 않은 userId 신청: ${userId}`);
  }

  // 프론트엔드로 타워 전달
  socket.emit("event", {
    handelrId: 9,
    payload: {
      towerData: towerData,
      id: newTower.id,
      lastAttack: newTower.lastAttack,
    },
  });
};

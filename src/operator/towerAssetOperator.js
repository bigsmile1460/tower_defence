import { prismaAsset } from "../lib/utils/prisma/index.js";

class towerAssetOperator {
  // 타워 모델 대량 생산
  async makeTowerModel(data) {
    return await prismaAsset.tower.createMany({
      data: data,
    });
  }

  // 만들어지는 타워 데이터들의 이름 출력
  towerNameMessage(towerDatas) {
    const Messages = [];
    for (const towerdata of towerDatas) {
      Messages.push(`${towerdata.towerName}가 생성되었습니다.`);
    }
    return Messages;
  }

  ////////////////
}

export default new towerAssetOperator();

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

  // 타워 강화 비율 데이터 생성
  async makeUpgradeRatioModel(upgradeRatio) {
    // 기존 데이터 조회
    const prevData = await prismaAsset.upgrade.findFirst({
      where: {
        id: 1,
      },
    });

    // 기존 데이터가 있을 경우 수정
    let data;
    if (prevData) {
      data = await prismaAsset.upgrade.update({
        where: {
          id: 1,
        },
        data: {
          upgradeRatio: upgradeRatio,
        },
      });
    }
    // 기존 데이터가 없을 경우 생성
    else {
      data = await prismaAsset.upgrade.create({
        data: {
          upgradeRatio: upgradeRatio,
        },
      });
    }

    return;
  }
}

export default new towerAssetOperator();

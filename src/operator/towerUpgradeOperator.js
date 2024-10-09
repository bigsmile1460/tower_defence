import { prismaAsset } from "../lib/utils/prisma/index.js";
import { getGold, getTower } from "../models/model.js";

class towerUpgradeOperator {
  async towerUpgradeCheck(tower, gold, userId) {
    // 타워 구매 후 서버 골드와 클라이언트 골드 비교
    const serverGold = getGold(userId);
    if (serverGold - tower.towerPrice !== gold) {
      throw new Error(
        "골드가 조작되었습니다: " + (serverGold - tower.towerPrice) + gold
      );
    }

    // 타워 기본 능력치
    const basicTower = await prismaAsset.tower.find({
      where: {
        id: tower.towerId,
      },
    });

    // 타워 강화 능력치 증가율
    const upgradeRatio = await prismaAsset.upgrade.find({
      where: {
        id: 1,
      },
    });

    // 서버에 저장된 타워 능력치와 강화된 타워 능력치 검증
    const serverTower = getTower(userId, tower.id);
    if (
      serverTower.attackPower + Math.floor(basicTower * upgradeRatio) !==
      tower.attackPower
    ) {
      throw new Error("타워의 능력치가 조작되었습니다: " + tower.attackPower);
    }
  }
}

export default new towerUpgradeOperator();

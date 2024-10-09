import express from "express";
import towerAssetOperator from "../operator/towerAssetOperator.js";

const router = express.Router();

// 타워 능력치 정의 모델 생성
router.post("/towerAsset", async (req, res, next) => {
  try {
    let towerDatas = req.body;

    // 만들어지는 타워 데이터들의 이름 메시지에 담기
    const Messages = towerAssetOperator.towerNameMessage(towerDatas);

    // 타워 모델 대량 생산
    await towerAssetOperator.makeTowerModel(towerDatas);

    // 메시지 출력
    res.status(200).json({ message: Messages });
  } catch (error) {
    next(error);
  }
});

// 타워 강화 상승 능력치 정의 모델 생성
router.post("/towerUpgrade", async (req, res, next) => {
  try {
    let { upgradeRatio } = req.body;

    // 타워 강화 상승 능력치 정의 모델 생성
    await towerAssetOperator.makeUpgradeRatioModel(upgradeRatio);

    // 메시지 출력
    res.status(200).json({
      message: `강화 능력치 상승 비율이 ${upgradeRatio}%로 설정되었습니다.`,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

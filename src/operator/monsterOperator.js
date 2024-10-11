import { prismaAsset } from "../lib/utils/prisma/index.js";

export const getMonster = (stageNo) => {
    return prismaAsset.monster.findMany({
        where: {stage: +stageNo}
    })
}

// 타워에 대한 휘발성 메모리 저장

import { prismaAsset } from "../lib/utils/prisma"

export const addtowerBuy = async(io,socket,payload,userid)=>{
const findTower = await prismaAsset.tower.findMany({
    where:{id:payload.id}
})
return findTower
}
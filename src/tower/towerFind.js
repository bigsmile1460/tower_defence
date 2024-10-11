import { prismaAsset } from "../lib/utils/prisma/index.js"

export const addtowerBuy = async (io,socket,payload,userid) =>{
   
    const findTower = await prismaAsset.tower.findMany({
        where:{id : payload.id }
    })

    return findTower;
}


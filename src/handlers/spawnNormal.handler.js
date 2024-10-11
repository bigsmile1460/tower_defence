import { getMonster, addMonster } from "../Storages/monster.storage.js"



export const spawnNormal = (userId, payload) => {
    console.log("--------------------------")
    console.log("spawnNormal userId:", userId)
    console.log("--------------------------")
    console.log("spawnNormal payload:", payload.id)
    const { stage } = payload
    
    const getMonsterInfo = getMonster(userId)

    if(getMonsterInfo.length === stage) {
        return { status: 'fail', message: '현재 모든 몬스터가 소환되어 있습니다.'}
    }
    //몬스터 추가
    addMonster(userId,stage)
    
    return { status: 'success', handler: 6}
}

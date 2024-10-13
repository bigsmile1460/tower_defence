// 몬스터에 대한 휘발성 메모리 저장
import { v4 as uuidv4 } from "uuid";
const monsterInfo = [];

//몬스터 정보
//플레이어ID(토큰이용), 체력, 공격력, 이동속도, 점수, 골드, 스테이지, UUID(객체정보),
// {userId: "example",
// {uuid:"uuid1",atk:1,hp:5,speed:1,score:1,stargoldtGold:1,stage:1},
// {uuid:"uuid1",atk:1,hp:5,speed:1,score:1,stargoldtGold:1,stage:1}}
//유저가 게임 진행중인 몬스터 생성
export const addMonster = (userId, monster) => {
  //몬스터 uuid 제공 - 객체 분류
  const monsterUUID = uuidv4();
  const monsterId = getMonster(userId);
  //유저의 몬스터 관리 공간 생성
  
  //생성되는 몬스터에게 객체 고유값 uuid 제공
  monster.uuid = monsterUUID;
  monsterInfo[userId].push(monster);
};

export const getMonsters = (userId) => {
  return monsterInfo[userId];
};


// 몬스터 객체 정보
export const getMonsterLength = (userId) => {
  if (monsterInfo[userId].length) {
    return monsterInfo[userId].length;
  } else {
    return 0;
  }
};
//몬스터 변동사항 - 타워가 몬스터 공격 시
export const updateMonster = (userId, monsterUUID, attack) => {
  //uuid값이 일치하는 몬스터한테 공격 실행
  if (monsterInfo[userId]) monsterInfo[userId].monsterUUID;

  //몬스터 hp 값이 0 이하가 되어 죽었을 경우
  if (monsterInfo[userId][hp] <= 0) {
    monsterInfo[userId].pop();
  }
};

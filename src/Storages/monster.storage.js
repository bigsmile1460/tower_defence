import { v4 as uuidv4 } from "uuid";

const monsterInfo = {};

//몬스터 정보
//플레이어ID, 체력, 공격력, 이동속도, 점수, 골드, 스테이지, UUID(객체정보),
// {userId: "example",
// {uuid:"uuid1",atk:1,hp:5,speed:1,score:1,stargoldtGold:1,stage:1},
// {uuid:"uuid1",atk:1,hp:5,speed:1,score:1,stargoldtGold:1,stage:1}}
//몬스터 추가 - 생성
export const addMonster = (userId, monster) => {
  // const monsterUUID = "example"
  //몬스터 uuid 제공 - 객체 분류
  const monsterUUID = uuidv4();
  if (!monsterInfo[userId]) {
    monsterInfo[userId] = [];
  }
  console.log("몬스터 정보:", monster);
  monsterInfo[userId].push(monster);
  console.log("monsterInfo: ", monsterInfo);
};

//몬스터 정보
// export const getMonster = (userId) => {
//     return monsterInfo[userId] || []
// }

//몬스터 변동
export const updateMonster = (userId, monsterUUID, attack) => {
  monsterInfo[userId][hp] = monsterInfo[userId][hp] - attack;

  if (monsterInfo[userId][hp] <= 0) {
    monsterInfo[userId].pop();
  }
};

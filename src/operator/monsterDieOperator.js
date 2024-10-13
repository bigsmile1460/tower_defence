import {
  getUserGold,
  getUserScore,
  setUserGold,
  setUserScore,
} from "../Storages/stage.storage.js";

// 몬스터 사망 시 처리
export const monsterDie = (socket, userId, monster) => {
  // 서버 데이터 처리 (점수, 골드)
  const diemonsterUUID = [];
  for (let i = 0; i < monster.length; i++) {
    // 유저 점수 추가
    const userScore = getUserScore(userId);
    const plusScore = monster[i].score;
    setUserScore(userId, userScore + plusScore);

    // 유저 골드 추가
    const userGold = getUserGold(userId);
    const plusGold = monster[i].gold;
    setUserGold(userId, userGold + plusGold);

    diemonsterUUID.push(monster[i].uuid);
  }

  // 클라이언트로 데이터 전달
  const userScore = getUserScore(userId);
  const userGold = getUserGold(userId);
  socket.emit("event", {
    handlerId: 4,
    payload: {
      userScore: userScore,
      userGold: userGold,
      diemonsterUUID: diemonsterUUID,
    },
  });
};

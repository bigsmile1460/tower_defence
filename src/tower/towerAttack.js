// 타워 공격
export const towerAttack = (io, socket, payload) => {
  try {
    // console.log("타워 공격 처리 성공");

    return { status: "success", Message: "타워 공격 성공!" };
  } catch (error) {
    console.log("타워 공격 정보 처리 중 에러 발생", error);
  }
};

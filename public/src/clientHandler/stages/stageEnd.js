// 게임 종료: 화면 새로고침
export const stageEnd = (payload) => {
  if (payload.clear === "clear") {
    location.replace(`/stageClear.html`);
  } else {
    location.replace(`/stageOver.html`);
  }
};

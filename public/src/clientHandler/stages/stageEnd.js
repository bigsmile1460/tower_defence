// 게임 종료: 화면 새로고침
export const stageEnd = (payload) => {
  if(payload)
    alert(payload)
  console.log("게임오버")
  
  location.reload();
};

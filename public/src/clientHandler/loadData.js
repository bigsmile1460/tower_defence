export const loadData = (data) => {
  if (data.initGameDB) {
    setLocalStorage("initGameDB", data.initGameDB);
    setLocalStorage("stages", data.stages);
    setLocalStorage("currentStage", getLocalStorage("stages")[0]);
    console.log({ status: "success", Message: "데이터 로드 성공!" });
    return;
  }

  if (data.currentStage) {
    setLocalStorage("currentStage", data.currentStage);
    console.log({ status: "success", Message: "데이터 로드 성공!" });
    return;
  }

  if (data.towerInfo) {
    setLocalStorage("towerInfo", data.towerInfo);
    setLocalStorage("userGold", data.userGold);
    console.log({ status: "success", Message: "데이터 로드 성공!" });
    return;
  }
  console.log({ status: "fail", Message: "데이터 로드 실패!" });
};

export const response = (data) => {
  console.log(data);
};

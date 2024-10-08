const registerHandler = (io) => {
  try {
    io.on("connection", async (socket) => {});
  } catch (error) {
    console.log("유저 연결 중 에러발생", error);
  }
};

export default registerHandler;

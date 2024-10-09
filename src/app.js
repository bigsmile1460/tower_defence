import express from "express";
import { createServer } from "http";
import initSocket from "./init/socket.js";
import dotenv from "dotenv";
import { prismaUsers } from "../prisma/utils/index.js";

const app = express();
const server = createServer(app);
dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
initSocket(server);

await prismaUsers.initStage.create({
  data: {
    baseHp: 0,
    startGold: 2000,
    serverHighScore: 1000,
  },
});
// 내 생각엔 여기에 토큰이 필요하다고 생각함
server.listen(PORT, async () => {
  console.log(`서버가 ${process.env.PORT}로 시작됩니다.`);
});

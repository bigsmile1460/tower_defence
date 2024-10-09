import express from "express";
import { createServer } from "http";
import initSocket from "./init/socket.js";
import usersRouter from "./routes/uers.router.js";
import dotenv from "dotenv";

const app = express();
const server = createServer(app);
dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use("/TowerDefence", [usersRouter]);

initSocket(server);

server.listen(PORT, async () => {
  console.log(`서버가 ${process.env.PORT}로 시작됩니다.`);
});

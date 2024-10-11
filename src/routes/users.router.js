import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { prismaUser } from "../lib/utils/prisma/index.js";
import { CreateAccessToken } from "../lib/utils/token/tokenCreate.js";

const usersRouter = express.Router();
dotenv.config();

usersRouter.post("/SignUp", async (req, res, next) => {
  const { email, password, passwordCheck } = req.body;
  console.log(email, password);
  const isExistUser = await prismaUser.user.findFirst({
    where: {
      email: email,
    },
  });

  if (email.length === 0) {
    return res.status(404).json({ message: "이메일을 입력해주세요" });
  }

  if (password.length === 0) {
    return res.status(404).json({ message: "비밀번호를 입력해주세요" });
  }

  if (isExistUser) {
    return res.status(404).json({ message: "이미 존재하는 이메일입니다." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prismaUser.user.create({
    data: {
      password: hashedPassword,
      email: email,
      highScore: 0,
    },
  });

  return res
    .status(201)
    .json({ status: 201, message: `${email}로 회원가입이 완료되었습니다.` });
});

usersRouter.post("/SignIn", async (req, res, next) => {
  const { email, password } = req.body;

  if (email.length === 0) {
    return res.status(404).json({ message: "이메일을 입력해주세요" });
  }

  if (password.length === 0) {
    return res.status(404).json({ message: "비밀번호를 입력해주세요" });
  }

  const LoginReqUser = await prismaUser.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!LoginReqUser) {
    return res
      .status(404)
      .json({ message: `${email}은 존재하지 않는 이메일입니다.` });
  }

  if (!(await bcrypt.compare(password, LoginReqUser.password))) {
    return res.status(404).json({ message: `비밀번호가 일치하지 않습니다.` });
  }

  const s2cAccessToken = CreateAccessToken(email);
  res.header("authorization", s2cAccessToken);

  return res
    .status(201)
    .json({ status: 201, message: `${email}로 로그인 성공` });
});

export default usersRouter;

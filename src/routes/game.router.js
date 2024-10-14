import express from "express";
import dotenv from "dotenv";
import authMiddleware from "./middlewares/auth.middleware.js"

const gameRouter = express.Router();
dotenv.config();

gameRouter.post("/GamePlay", authMiddleware, async (req, res, next) => {

    return res
        .status(201)
        .json({ status: 201, message: `게임 시작` });
});

export default gameRouter;
import express from "express";
import dotenv from "dotenv";
import authMiddleware from "./middlewares/auth.middleware.js"

const gameRouter = express.Router();
dotenv.config();

const gameplay = [];

gameRouter.post("/GamePlay", authMiddleware, async (req, res, next) => {
    let isPlaying = false;

    if (gameplay.length > 0) {
        for (let i = 0; i < gameplay.length; i++) {
            if (gameplay[i] === req.user.email) {
                isPlaying = true;
                break;
            }
        }
    }

    if (!isPlaying) {
        gameplay.push(req.user.email);

        return res
            .status(201)
            .json({ status: 201, message: `게임 시작` });
    }
    else {
        return res
            .status(401)
            .json({ status: 401, message: `중복 게임 플레이` });
    }
});

export default gameRouter;
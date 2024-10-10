import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

export function CreateAccessToken(email) {
    const accessToken = jwt.sign(
        { email: email },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME }
    );

    return process.env.TOKEN_TYPE + accessToken;
}

export function ValidateToken(token, secretkey) {
    try {
        const payload = jwt.verify(token, secretkey);
        return payload;
    }
    catch (error) {
        return null;
    }
}
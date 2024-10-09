import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

export const prismaUser = new PrismaClient({
  log: ["query", "info", "warn", "error"],
  errorFormat: "pretty",
  datasources: {
    db: {
      url: process.env.DATABASE_URL_USER,
    },
  },
});

export const prismaAsset = new PrismaClient({
  log: ["query", "info", "warn", "error"],
  errorFormat: "pretty",
  datasources: {
    db: {
      url: process.env.DATABASE_URL_ASSET,
    },
  },
});

import { PrismaClient as PrismaUserClient } from "../../../../prisma/userPrisma/client/index.js";
import { PrismaClient as PrismaAssetClient } from "../../../../prisma/assetPrisma/client/index.js";
import dotenv from "dotenv";

dotenv.config();

export const prismaUser = new PrismaUserClient({
  log: ["query", "info", "warn", "error"],
  errorFormat: "pretty",
  datasources: {
    db: {
      url: process.env.DATABASE_URL_USER,
    },
  },
});

export const prismaAsset = new PrismaAssetClient({
  log: ["query", "info", "warn", "error"],
  errorFormat: "pretty",
  datasources: {
    db: {
      url: process.env.DATABASE_URL_ASSET,
    },
  },
});

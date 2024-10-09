import { PrismaClient as PrismaUser } from "../schema/generated/client2/index.js";
import { PrismaClient as PrismaAsset } from "../schema/generated/client1/index.js";

export const prismaUsers = new PrismaUser({
  log: ["query", "info", "warn", "error"],

  errorFormat: "pretty",
});

export const prismaAssets = new PrismaAsset({
  log: ["query", "info", "warn", "error"],

  errorFormat: "pretty",
});

// export const prismaUser = new client2({
//   log: ["query", "info", "warn", "error"],

//   errorFormat: "pretty",
// });

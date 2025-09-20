/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = process.env.DEMO_USER_EMAIL?.trim() || "demo@atlas.ai";
  const password = process.env.DEMO_USER_PASSWORD || "AtlasDemo!2025";
  const name = process.env.DEMO_USER_NAME?.trim() || "Atlas Demo";

  const hashedPassword = await hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name,
      password: hashedPassword,
    },
    update: {
      name,
      password: hashedPassword,
    },
  });

  console.log(`Seeded demo user ${user.email} with password "${password}".`);
  console.log("You can update or disable the demo credentials by setting DEMO_USER_* env vars before running the seed.");
}

main()
  .catch((error) => {
    console.error("Failed to seed demo user", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

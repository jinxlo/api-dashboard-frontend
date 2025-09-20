/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_USER_EMAIL?.trim();
  const password = process.env.SEED_USER_PASSWORD;
  const name = process.env.SEED_USER_NAME?.trim() || "Atlas Admin";

  if (!email || !password) {
    console.log("No SEED_USER_EMAIL/SEED_USER_PASSWORD provided. Skipping user seed.");
    return;
  }

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

  console.log(`Seeded user ${user.email}. Remember to store the generated credentials securely.`);
}

main()
  .catch((error) => {
    console.error("Failed to seed initial user", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// prisma/seed.js

const { PrismaClient } = require("../src/generated/prisma");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin", 10);

  await prisma.admin.upsert({
    where: { email: "admin@admin.fr" },
    update: {},
    create: {
      email: "admin@admin.fr",
      password: hashedPassword,
    },
  });

  console.log("Compte administrateur créé avec succès.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
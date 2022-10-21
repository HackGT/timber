import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const hackathon = await prisma.hackathon.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: {
      name: "HackGT 8",
    },
  });

  const config = await prisma.config.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: {
      currentHackathonId: hackathon.id,
    },
  });
}

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

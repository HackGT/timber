import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const hackathon = await prisma.hackathon.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: {
      name: "Temporary Hackathon",
    },
  });

  console.log("HACKATHON");
  console.log(hackathon);

  const config = await prisma.config.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: {
      currentHackathonId: hackathon.id,
    },
  });

  console.log("CONFIG");
  console.log(config);
}

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

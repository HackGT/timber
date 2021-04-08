import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const config = await prisma.config.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: {},
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

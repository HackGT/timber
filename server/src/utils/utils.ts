import { prisma } from "../common";

export const getConfig = async () => {
  const config = await prisma.config.findFirst();

  if (!config) {
    throw new Error("Config does not exist. Please ensure your database is setup properly.");
  }

  return config;
};

export const getCurrentHackathon = async () => {
  const config = getConfig();

  const currentHackathon = await prisma.hackathon.findUnique({
    where: {
      id: (await config).currentHackathonId,
    },
  });

  if (!currentHackathon) {
    throw new Error("Current hackathon doesn't exist. Please check database is correct.");
  }

  return currentHackathon;
};

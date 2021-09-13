import * as schedule from "node-schedule";

import { prisma } from "../common";

export async function scheduleJobs() {
  // Execute jobs every 5 seconds
  schedule.scheduleJob("*/5 * * * * *", async () => {
    const config = await prisma.config.findFirst();

    if (config?.isJudgingOn) {
      console.log("Running auto assign...");
      // TODO: Add backend auto assign job here
    }
  });
}

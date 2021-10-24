import rp from "request-promise";
import cheerio from "cheerio";
import { User, UserRole } from "@prisma/client";
import { URL } from "url";

import { prisma, prizeConfig } from "../common";
import { getCurrentHackathon } from "./utils";
import { queryRegistration } from "../registration";

const HACKGT_DEVPOST = process.env.DEVPOST_URL || "https://hackgt2020.devpost.com/";

/*
    - Classify team into prize based on user tracks (from registration)
    - Return eligible prizes based on team type
*/
export const getEligiblePrizes = async (users: any[]) => {
  const currentHackathon = await getCurrentHackathon();
  switch (currentHackathon.name) {
    case "HackGT 7": {
      let numEmerging = 0;

      for (const user of users) {
        if (!user || !user.confirmationBranch) {
          return {
            error: true,
            message: `User: ${user.email} does not have a confirmation branch`,
          };
        }

        if (user.confirmationBranch === "Emerging Participant Confirmation") {
          numEmerging += 1;
        }
      }

      // A team must be greater than 50% emerging to be eligible for emerging prizes
      if (numEmerging / users.length > 0.5) {
        return prizeConfig.hackathons["HackGT 7"].emergingPrizes.concat(
          prizeConfig.hackathons["HackGT 7"].sponsorPrizes
        );
      }

      return prizeConfig.hackathons["HackGT 7"].sponsorPrizes;
    }
    default: {
      return [];
    }
  }
};

/*
    - Query emails from check-in and ensure users accepted to event
    - Create new user objects for users not in db (with email field and name from check-in)
*/
export const validateTeam = async (currentUser: User | undefined, members: any[]) => {
  if (!members || members.length === 0) {
    return { error: true, message: "Must include at least one member" };
  }

  if (members.length > 4) {
    return { error: true, message: "Too many members on team" };
  }

  const memberEmails: string[] = members.map(member => member.email);

  if (!currentUser || memberEmails[0] !== currentUser.email) {
    return { error: true, message: "Email does not match current user" };
  }

  let registrationError = null;
  const currentHackathon = await getCurrentHackathon();

  const registrationUsers: any[] = await Promise.all(
    memberEmails.map(async email => {
      let res: any;
      try {
        res = await queryRegistration(email);
      } catch (error) {
        console.error(error);
        registrationError = {
          error: true,
          message: `There was an unknown error accessing registration. Please contact a member of the event staff.`,
        };
        return "";
      }

      const searchUsers = res.data.data.search_user.users;

      if (searchUsers.length === 0 || !searchUsers[0].confirmed) {
        registrationError = {
          error: true,
          message: `User: ${email} not confirmed for current ${currentHackathon.name}`,
        };
        return "";
      }

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        await prisma.user.create({
          data: {
            name: searchUsers[0].name,
            email,
            role: UserRole.GENERAL,
          },
        });
      } else {
        const existingProject = await prisma.project.findFirst({
          where: {
            members: {
              some: {
                id: user.id,
              },
            },
            hackathonId: currentHackathon.id,
          },
        });

        if (existingProject != null) {
          registrationError = {
            error: true,
            message: `User: ${user.email} already has a submission for current ${currentHackathon.name}`,
          };
          return "";
        }
      }

      return searchUsers[0];
    })
  );

  if (registrationError != null) {
    return registrationError;
  }

  const eligiblePrizes = await getEligiblePrizes(registrationUsers);
  return { error: false, eligiblePrizes, registrationUsers };
};

/*
    - Ensure url is the right devpost url
    - Ensure project isn't submitted to multiple hackathons
*/
export const validateDevpost = async (devpostUrl: string, submissionName: string) => {
  if (!devpostUrl) {
    return { error: true, message: "No url specified" };
  }

  const { hostname } = new URL(devpostUrl);
  if (hostname !== "devpost.com") {
    return { error: true, message: "Invalid URL: Not a devpost domain" };
  }

  let html = "";
  try {
    html = await rp(devpostUrl);
  } catch (err) {
    return { error: true, message: "Invalid Project URL" };
  }

  const $ = cheerio.load(html);
  const devpostUrls = [];
  let submitted = false;
  $("#submissions")
    .find("ul")
    .children("li")
    .each((_index, elem) => {
      const item = $(elem).find("div a").attr("href");
      if (item) {
        devpostUrls.push(item);
        if (item === HACKGT_DEVPOST) {
          submitted = true;
        }
      }
    });

  const devpostCount = await prisma.project.count({ where: { devpostUrl } });
  const nameCount = await prisma.project.count({ where: { name: submissionName } });

  const eligible = submitted && devpostUrls.length === 1 && devpostCount === 0 && nameCount === 0;

  if (eligible) {
    return { error: false };
  }
  if (!submitted) {
    return {
      error: true,
      message:
        "Please submit your project to the hackathon devpost and try again. Follow the instructions below.",
    };
  }
  if (devpostUrls.length !== 1) {
    return { error: true, message: "You cannot have multiple hackathon submissions." };
  }
  if (devpostCount !== 0) {
    return { error: true, message: "A submission with this Devpost URL already exists." };
  }
  if (nameCount !== 0) {
    return { error: true, message: "A submission with this name already exists." };
  }
  return { error: true, message: "Please contact help desk" };
};

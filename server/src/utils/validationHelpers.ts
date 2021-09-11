import { User, UserRole } from "@prisma/client";
import { URL } from "url";
import rp from "request-promise";
import cheerio from "cheerio";
import dotenv from "dotenv";
import axios from "axios";

import { prisma } from "../common";

dotenv.config();

// todo: integrate eligibility criteria & logic
export const getEligiblePrizes = (users: User[]) => null;

export const validateTeam = async (members: User[], userEmail: string) => {
  if (!members || !members.length)
    return { error: true, message: "Teams must include at least one member." };
  if (members.length > 4)
    return { error: true, message: "Teams must include less than four members." };
  if (members[0].email !== userEmail)
    return { error: true, message: "Email doesn't match current user." };

  const emails = members.map((member: User) => member.email);
  let errConfirmed = null,
    errSubmission = null;

  const registrationUsers = await Promise.all(
    emails.map(async email => {
      const response = await axios({
        method: "POST",
        url: process.env.GRAPHQL_URL,
        headers: {
          "Authorization": `Bearer ${process.env.GRAPHQL_AUTH}`,
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          query: `
            query($search: String!) {
              search_user(search: $search, offset: 0, n: 1) {
                users {
                  name
                  email
                  confirmationBranch
                  confirmed
                }
              }
            }
          `,
          variables: { search: email },
        }),
      });

      const regUsers = response.data.data.search_user.users;
      if (!regUsers.length || !regUsers[0].confirmed) {
        errConfirmed = email;
        return;
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        await prisma.user.create({
          data: {
            // todo: implement better unique generation method
            uuid: Math.floor(Math.random() * 1000000).toString(),
            token: Math.floor(Math.random() * 1000000).toString(),
            email,
            name: regUsers[0].name,
            role: UserRole.PARTICIPANT,
          },
        });
      } else {
        const hackathon = await prisma.hackathon.findFirst({
          where: { name: process.env.HACKATHON },
        });
        const submissions = await prisma.project.findMany({
          where: {
            members: { some: user },
            hackathon: hackathon!,
          },
        });
        if (submissions.length > 0) {
          errSubmission = user.email;
          return;
        }
      }

      return regUsers[0];
    })
  );

  if (errConfirmed)
    return { error: true, message: `${errConfirmed} is not yet confirmed to attend.` };
  if (errSubmission)
    return { error: true, message: `A submission already exists for ${errSubmission}.` };
  return { error: false, eligiblePrizes: getEligiblePrizes(registrationUsers) };
};

export const validateDevpost = async (name: string, devpostUrl: string) => {
  if (!devpostUrl) return { error: true, message: "No Devpost URL specified." };
  if (new URL(devpostUrl).hostname !== "devpost.com")
    return { error: true, message: "URL is not a Devpost domain." };

  const res = await rp(devpostUrl).catch(() => ({ error: true }));
  if (res.error) return { error: true, message: "Invalid project URL." };

  let submitted = false;
  const devpostUrls = [];
  const $ = cheerio.load(res);

  $("#submissions")
    .find("ul")
    .children("li")
    .each((_i, elem) => {
      const item = $(elem).find("div a").attr("href");
      if (item) {
        devpostUrls.push(item);
        submitted = item === process.env.HACKGT_DEVPOST;
      }
    });

  const devpostCount = await prisma.project.count({ where: { devpostUrl } });
  const nameCount = await prisma.project.count({ where: { name } });

  if (submitted && devpostUrls.length === 1 && !devpostCount && !nameCount) {
    return { error: false };
  }
  if (!submitted) {
    return { error: true, messsage: "Please submit your project to the Devpost and try again." };
  }
  if (devpostUrls.length !== 1) {
    return { error: true, message: "You cannot have multiple hackathon submissions." };
  }
  if (devpostCount) {
    return { error: true, message: "A submission with this Devpost URL already exists." };
  }
  if (nameCount) {
    return { error: true, message: "A submission with this name already exists." };
  }
  return { error: true, message: "An unexpected error occurred. Please contact the help desk." };
};

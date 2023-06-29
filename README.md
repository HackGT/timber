# Timber

Hexlab's mystical new project submission and judging system for hackathons and other events. Goes by
many names such as Ballot, Expo, and Timber. Used most recently at HackGT 9.

## Getting Started

### Client

1. `yarn install` in the root directory
2. `yarn start`

### Server

Timber runs on Hexlab's new backend API. Check it out [at this link](https://github.com/HackGT/api)
to set up the API repo. Follow the guide in the wiki to understand the architecture of the API and
how Timber works behind the scenes. Timber is referred to as 'Expo' in the API repo for future
naming reference. However, follow the steps below to set up the server within the expo folder in the API repo

## Server
1. `cd server then yarn install`
2. `yarn migrate:dev to setup database`
3. `yarn prisma-generate to generate prisma types`
4. `yarn seed to seed database`
5. `yarn dev`


After setting up the API repo and starting it up, the Timber backend is hosted under Expo. In
production this is expo.api.hexlabs.org. For local development, this is http://localhost:8007/expo.

## Features

Timber has many features to facilitate project submission and judging for a smooth experience for
judges, participants, and sponsors. More features are always being developed by Hexlab's tech team.
Feel free to suggest a new feature or update by submitting an issue!

Here are an overview of the core features:

### Project Submission

### Admin Page

### Judging

### Epicenter

### Rankings

### Winners

## Past Events

Timber has been used at many of Hexlab's past events. These include but are not limited to:

- HackGT 9
- Horizons 2022
- Prototypical 2022
- HackGT 8
- HealthTech 2021
- and many more in the future!

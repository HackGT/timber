# Timber

Hexlab's mystical new project submission and judging system for hackathons and other events. Goes by
many names such as Ballot, Expo, and Timber. Used most recently at HackGT 10.

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
1. `yarn install`
2. `cd services/expo`
3. `yarn migrate:dev to setup database`
5. `yarn seed to seed database`

Now, the job isn't finished yet, because if you try to visit the client, it will have an endless loop
between [login.hexlabs.org](https://login.hexlabs.org) and the dev site. This is because we haven't
set the value of `currentHexathon` in the expo config database. Follow these steps next:

1. Use the [create hexathon route](https://docs.hexlabs.org/#/hexathons/post_hexathons) to create a hexathon if you don't have one
2. Use the [update currentHexathon config route](https://github.com/HackGT/api/blob/main/services/expo/src/routes/config.ts#L106)
to set the value as the `id` of the hexathon object

Finally, you should be able to load the frontend now.

After setting up the API repo and starting it up, the Timber backend is hosted under Expo. In
production this is expo.api.hexlabs.org. For local development, this is http://localhost:8007.

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
- HackGT 10
- Horizons 2023
- HackGT 9
- Horizons 2022
- Prototypical 2022
- HackGT 8
- HealthTech 2021
- and many more in the future!

# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

## Seed db

`npx prisma db seed`

# Home Server Deployment

This directory contains files needed to deploy the application to your home server.

## Initial Setup

1. Copy these files to your home server:

   ```
   scp -r ./deploy user@home-server:~/deployments/t3-chronistic
   ```

2. On your GitHub repository, add the following secrets:

   - DOCKER_HUB_USERNAME: Your Docker Hub username
   - DOCKER_HUB_TOKEN: Your Docker Hub access token
   - HOME_SERVER_HOST: IP address or hostname of your home server
   - HOME_SERVER_USERNAME: SSH username for your home server
   - HOME_SERVER_SSH_KEY: SSH private key for connecting to your home server

3. Ensure Docker and Docker Compose are installed on your home server.

4. Push to your main branch to trigger the CI/CD pipeline, or manually trigger the workflow from GitHub Actions.

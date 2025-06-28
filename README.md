# Chronistic

Chronistic is a story boarding tool used for keeping track of stories.

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## Deployment

T3 deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

### Home Server Deployment

This directory contains files needed to deploy the application to your home server.

### Initial Setup

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

## Prisma db management

### Seeding the db

`npx prisma db seed`

### Local dev

If you're working localy then it's very convenient to just run `npx prisma db push` to just push the schema state to the db.
Use `npx prisma generate` to push the schema changes to the client so that you can get type safety when you import the client.

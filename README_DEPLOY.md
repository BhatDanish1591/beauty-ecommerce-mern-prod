# Deployment Guide (Vercel)

I have prepared your MERN stack application for a unified deployment on Vercel.

## Pre-deployment Checklist
1. **MongoDB Atlas**: Ensure you have a MongoDB Atlas account. Create a cluster and get your connection string.
2. **Environment Variables**: You will need to add these to Vercel:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A secret string for token signing.
   - `NODE_ENV`: Set to `production`.

## Deployment Steps

### Option 1: Vercel Dashboard (Easiest)
1. Push your code to a GitHub/GitLab/Bitbucket repository.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"New Project"**.
3. Import your repository.
4. **Project Settings**:
   - **Framework Preset**: Other (Vercel will detect the `vercel.json`).
   - **Root Directory**: `./` (the root of the project).
5. **Environment Variables**: Add `MONGO_URI` and `JWT_SECRET`.
6. Click **Deploy**.

### Option 2: Vercel CLI
If you have Vercel CLI installed, run:
```bash
npx vercel
```
Follow the prompts, then:
```bash
npx vercel --prod
```

## What I Changed
- **Unified Structure**: Added a root `package.json` and `vercel.json` to manage both client and server as one project.
- **Serverless Backend**: Created `api/index.js` to bridge your Express server to Vercel's serverless functions.
- **Relative API Calls**: Refactored the frontend to use relative paths (`/api`) so it works seamlessly on the same domain.
- **DB Optimization**: Updated the MongoDB connection logic to handle serverless cold starts and reuse connections.

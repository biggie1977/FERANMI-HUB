# FERANMI-HUB

A modern fashion / personal branding website for STYLEDBYGBABY, built with Node.js and Express. The project includes a portfolio-style frontend and a lightweight contact API.

## Project structure

- `backend/server.js` – Express server and contact form API
- `frontend/` – static website pages and assets
- `server.js` – root entry point
- `package.json` – project scripts and dependencies

## Features

- Responsive landing page and multi-page portfolio layout
- Contact form with server-side validation and rate limiting
- Styling gallery and moodboard sections
- Express static hosting for the frontend

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the app:

   ```bash
   npm start
   ```

3. Open the site in your browser:
   ```text
   http://localhost:3000
   ```

## Deployment

This app is not a static GitHub Pages project because it includes an Express backend and API routes. The best deployment options are Node-compatible hosts such as Render, Railway, or Vercel.

### Deploy on Render

1. Push this repo to GitHub.
2. Log in to Render.
3. Create a new Web Service.
4. Connect the GitHub repository.
5. Use:
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Deploy.

### Deploy on Railway

1. Push this repo to GitHub.
2. Create a new project in Railway.
3. Select "Deploy from GitHub Repo" and choose this repository.
4. Use the default Node service settings.
5. Set the start command to:
   ```bash
   npm start
   ```
6. Add environment variables as needed, such as `ADMIN_KEY`.

### Deploy on Vercel

Vercel works best for frontend-only projects. For this app, either:
- deploy the Express server as a Node app on a Vercel-compatible Node host, or
- split the frontend and backend into separate deployment targets.

If you want a simple Node deployment flow, Render or Railway is the easiest fit for this project.

## Notes

- `node_modules` is ignored via `.gitignore`.
- The contact endpoint stores enquiries in `backend/enquiries.json`.
- Set an admin key as an environment variable if needed for protected admin routes:
  ```bash
  ADMIN_KEY=your-secret-key
  ```

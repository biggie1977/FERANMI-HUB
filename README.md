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

This app is not a static GitHub Pages project because it includes an Express backend and API routes. A better deployment option is a Node host such as Render or Railway.

### Deploy on Render

1. Push this repo to GitHub.
2. Log in to Render.
3. Create a new Web Service.
4. Connect the GitHub repository.
5. Use:
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Deploy.

## Notes

- `node_modules` is ignored via `.gitignore`.
- The contact endpoint stores enquiries in `backend/enquiries.json`.
- Set an admin key as an environment variable if needed for protected admin routes:
  ```bash
  ADMIN_KEY=your-secret-key
  ```

# Momentum Frontend

This directory contains the React/Next.js frontend for **Momentum**. The UI
provides an intuitive workflow for coaches and consultants to generate
beautiful, branded deliverables from their session notes or recordings. The
frontend communicates with the Momentum backend to perform transcription,
summarisation and deliverable generation.

## Features

* **Responsive user interface** built with Next.js and Tailwind CSS.
* **Dashboard** listing previously generated deliverables with links to view
  and download them.
* **New deliverable wizard** that lets users either paste a transcript or
  upload an audio/video file. Includes customisable brand colours and logo.
* **Branded templates** rendered from server‑generated HTML and converted to
  PDF client‑side via `html2canvas` and `jsPDF`.
* **Brand settings page** for storing default colours and logo locally in the
  browser (can be extended to persist remotely).

## Getting Started Locally

1. **Install dependencies**. From inside the `momentum_frontend` directory
   run:

   ```bash
   npm install
   ```

2. **Configure environment variables**. The frontend needs to know where
   your backend API is running. Create a `.env.local` file at the root of
   this directory with the following content:

   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   ```

   Replace the URL with your deployed backend endpoint when running in
   production.

3. **Run the development server**:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`. You can now
   navigate to `/dashboard` to see your deliverables or `/new` to create
   one.

## User Stories & Implemented Features

The following user stories guided the development of this MVP:

1. **Account setup and branding** – As a coach I want to set my brand
   colours and logo so that all my client deliverables reflect my brand.
2. **Upload session recording** – As a coach I want to upload audio or
   video from a client session so that I can generate a report without
   typing up notes.
3. **Paste session transcript** – As a coach I want to paste rough notes
   from my session to quickly generate a polished deliverable.
4. **Automatic summarisation** – As a coach I want the system to produce
   highlights, goals, action items and next steps so I don’t have to
   manually structure my notes.
5. **Branded document rendering** – As a coach I want the deliverables to
   include my brand colours and logo so they look professional.
6. **Downloadable PDF** – As a coach I want to download the deliverable as
   a PDF to send to my client.
7. **View past deliverables** – As a coach I want a dashboard where I can
   review all previous reports.

Future iterations could include authentication, shared client portals,
analytics, reminders and integrations with calendar and meeting platforms.

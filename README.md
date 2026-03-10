# Calmly - Calendar Grid

A clean, dark-themed calendar grid application with task management, drag and drop, worldwide holidays, and import/export -- built with TypeScript, React, Next.js, Styled-Components, and MongoDB.

---

## Features

### Required (all implemented)
- **Calendar grid** -- built from scratch, no calendar libraries
- **Inline task creation and editing** -- click + or double-click a task
- **Drag and drop between days** -- reassign tasks across cells
- **Drag and drop reorder** -- reorder tasks within the same cell
- **Search filter** -- filter all tasks by text in real time
- **Worldwide holidays** -- fetched from Nager.Date API, fixed in cells (not draggable/reorderable)
- **MongoDB persistence** -- full Node.js CRUD via Next.js API routes

### Bonus
- **Import/Export** -- .ics (Google Calendar, Apple, Outlook), .json, and .csv
- **Country selector** -- switch holiday region with 30 countries
- **Animated cat mascot** -- reacts to your calendar status in real time
- **Notification sounds** -- cute procedural audio (Web Audio API) for every action
- **Toast notifications** -- contextual messages with mascot moods
- **Sound toggle** -- mute/unmute with one click
- **Overdue detection** -- visual red indicators + worried mascot for past-due tasks
- **Responsive** -- works on desktop and tablets
- **Loading states** -- smooth loading indicator
- **Keyboard support** -- Enter to save, Escape to cancel

### Mascot Moods and Scenarios

The Calmly cat mascot reacts to what's happening:

| Scenario                    | Mood     | Sound             |
|-----------------------------|----------|-------------------|
| Welcome / first load        | Love     | Sweet rising meow |
| Task created                | Happy    | Kitten chirp      |
| Task edited                 | Calm     | Double tap purr   |
| Task deleted/completed      | Proud    | Soft farewell     |
| Drag and drop               | Excited  | Playful bounce    |
| Tasks due today             | Calm     | Gentle chime      |
| Overdue tasks               | Worried  | Low mewl          |
| Many overdue tasks          | Sad      | Descending sigh   |
| Import success              | Excited  | Ascending trill   |
| Export success              | Proud    | Warm purr         |
| Error / failed action       | Annoyed  | Short buzz        |
| No tasks at all             | Sleepy   | Soft yawn         |
| Weekend                     | Sleepy   | Soft yawn         |

---

## Tech Stack

| Requirement          | Implementation               |
|----------------------|------------------------------|
| TypeScript           | Entire codebase              |
| React                | v18 with Hooks               |
| React Hooks          | useState, useEffect, useRef, useCallback, useMemo |
| CSS-in-JS            | Styled-Components v6         |
| Database             | MongoDB via Next.js API routes |
| Holidays API         | https://date.nager.at/api/v3 |
| Deployment           | Vercel-ready                 |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB database (local or MongoDB Atlas free tier: https://cloud.mongodb.com)

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/calmly.git
cd calmly
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit .env.local and add your MongoDB connection string:

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/calmly?retryWrites=true&w=majority
```

MongoDB Atlas (free) setup:
1. Go to https://cloud.mongodb.com and create a free M0 cluster
2. Create a database user with password
3. Whitelist 0.0.0.0/0 in Network Access (required for Vercel)
4. Copy the connection string and paste into .env.local

### 4. Run locally

```bash
npm run dev
```

Open http://localhost:3000

---

## Deploy to Vercel

### Option A: One-click (recommended)
1. Push your repo to GitHub
2. Go to https://vercel.com/new and import your repo
3. Add environment variable: MONGODB_URI = your connection string
4. Click Deploy

### Option B: Vercel CLI

```bash
npm i -g vercel
vercel
```

Follow the prompts and add MONGODB_URI when asked.

---

## Project Structure

```
calmly/
  src/
    app/
      layout.tsx              -- Root layout + styled-components SSR
      page.tsx                -- Home page
      api/tasks/
        route.ts              -- GET all, POST create, PUT bulk update
        [id]/route.ts         -- PUT single, DELETE single
    components/
      Calendar.tsx            -- Main calendar component (all logic)
      CalmlyMascot.tsx        -- Animated SVG cat mascot with 9 moods
      ToastSystem.tsx         -- Toast notifications with mascot + sounds
      StyledComponents.ts     -- All styled-components (CSS-in-JS)
    lib/
      mongodb.ts              -- MongoDB connection singleton
      registry.tsx            -- Styled-components SSR registry
      types.ts                -- TypeScript interfaces
      constants.ts            -- Country list
    utils/
      calendar.ts             -- Date helpers
      ics.ts                  -- ICS/JSON/CSV import and export
      sounds.ts               -- Web Audio API procedural sounds
  .env.example
  next.config.js
  tsconfig.json
  package.json
  README.md
```

---

## API Endpoints

| Method   | Endpoint                      | Description                        |
|----------|-------------------------------|------------------------------------|
| GET      | /api/tasks?year=2026&month=2  | Fetch tasks for a month            |
| POST     | /api/tasks                    | Create a task { text, dateKey, order } |
| PUT      | /api/tasks                    | Bulk update { tasks: [...] }       |
| PUT      | /api/tasks/[id]               | Update single task                 |
| DELETE   | /api/tasks/[id]               | Delete single task                 |

---

## Import / Export

| Format | Export | Import | Compatible With                          |
|--------|--------|--------|------------------------------------------|
| .ics   | Yes    | Yes    | Google Calendar, Apple Calendar, Outlook |
| .json  | Yes    | Yes    | Re-import into Calmly                    |
| .csv   | Yes    | Yes    | Excel, Google Sheets                     |

---

## License

MIT

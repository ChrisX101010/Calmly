# Calmly - Calendar Grid

A calendar grid application with inline task management, drag-and-drop sticky notes, worldwide holidays, meeting reminders with animated mascot notifications, and import/export. Built with TypeScript, React (Hooks), Next.js, Styled-Components, and MongoDB.

---

## Features

### Required (all implemented)
- Calendar grid -- built from scratch, no calendar libraries
- Inline task creation and editing -- click + or double-click a note
- Drag and drop between days -- reassign sticky notes across cells
- Drag and drop reorder -- reorder notes within the same cell
- Search filter -- filter all tasks by text in real time
- Worldwide holidays -- fetched from Nager.Date API, fixed in cells (not draggable)
- MongoDB persistence -- full Node.js CRUD via Next.js API routes
- TypeScript -- entire codebase
- React Hooks -- useState, useEffect, useRef, useCallback, useMemo
- CSS-in-JS -- Styled-Components v6 throughout

### Bonus Features
- Sticky note whiteboard UI -- tasks render as colored paper notes with tape, rotation, shadows
- Animated cat mascot -- reacts to your calendar status, task content, and holidays
- Full-screen meeting reminders -- approaching, on-time, late, missed with ringtone melodies
- Sentiment detection -- mascot reacts to task text (love, stress, travel, food, etc.)
- Holiday-themed mascot -- wears costumes (santa hat, bunny ears, etc.) on holidays
- Task detail panel -- labels, notes, meeting links, time picker
- Live clock -- synced to user timezone in the header
- Auto-detected country -- holidays load based on browser timezone
- Import/Export -- .ics (Google Calendar, Apple, Outlook), .json, .csv
- Sync prompt -- offers to export tasks to other calendars after adding
- Sound effects -- procedural Web Audio API sounds with mute toggle
- Max 6 notes per day -- prevents overcrowding the whiteboard

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
- MongoDB database (local or MongoDB Atlas free tier)

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/calmly.git
cd calmly
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit .env.local with your MongoDB connection string:

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/calmly?retryWrites=true&w=majority
```

### 3. Run locally

```bash
npm run dev
```

Open http://localhost:3000

---

## Deploy to Vercel

1. Push repo to GitHub
2. Go to https://vercel.com/new and import the repo
3. Add environment variable: MONGODB_URI = your connection string
4. Click Deploy

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
      Calendar.tsx            -- Main calendar component
      CalmlyMascot.tsx        -- Animated SVG cat mascot (13 moods)
      FullScreenMascot.tsx    -- Full-screen meeting reminder overlays
      TaskDetailPanel.tsx     -- Task detail with labels, notes, links
      SyncPrompt.tsx          -- Calendar sync prompt
      LiveClock.tsx           -- Real-time clock synced to timezone
      ToastSystem.tsx         -- Toast notifications with mascot
      StyledComponents.ts     -- All styled-components (CSS-in-JS)
    lib/
      mongodb.ts              -- MongoDB connection singleton
      registry.tsx            -- Styled-components SSR registry
      types.ts                -- TypeScript interfaces
      constants.ts            -- Country list
    utils/
      calendar.ts             -- Date helpers
      ics.ts                  -- ICS/JSON/CSV import and export
      sentiment.ts            -- Task text sentiment detection
      sounds.ts               -- Web Audio API sound effects
  .env.example
  next.config.js
  tsconfig.json
  package.json
  README.md
```

---

## API Endpoints

| Method | Endpoint                     | Description                           |
|--------|------------------------------|---------------------------------------|
| GET    | /api/tasks?year=2026&month=2 | Fetch tasks for a month               |
| POST   | /api/tasks                   | Create task (text, dateKey, time, etc) |
| PUT    | /api/tasks                   | Bulk update for drag-and-drop         |
| PUT    | /api/tasks/[id]              | Update single task                    |
| DELETE | /api/tasks/[id]              | Delete single task                    |

---

## License

MIT

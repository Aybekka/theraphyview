# TheraphyView

TheraphyView is a single-page application for finding licensed psychologists.
Visitors can browse specialists, compare them by rating and price, read client
reviews, and book an appointment online. Registered users can additionally save
psychologists to a personal favorites list that persists between sessions.

## Pages

- **Home** — hero section with the project slogan and a call-to-action leading
  to the catalog.
- **Psychologists** — paginated catalog (3 cards per page, "Load more") with
  sorting and filtering: A to Z / Z to A, price, popularity.
- **Favorites** — private page with the psychologists the signed-in user has
  marked with a heart.

## Features

- Email/password authentication (registration, login, logout) via Firebase
  Authentication, with modal forms validated by react-hook-form + yup.
- Psychologists data served from Firebase Realtime Database with indexed,
  cursor-based pagination (composite `startAfter(value, key)` cursors,
  `limitToLast` + `endBefore` for descending order).
- Favorites stored per user in Realtime Database and synced live.
- Expandable cards with client reviews and an appointment modal (name, phone,
  meeting time, email, comment) that shows a success confirmation.
- Fully responsive layout (320 / 768 / 1440).

## Tech Stack

- React 19 + Vite
- React Router 7
- Firebase (Authentication + Realtime Database)
- react-hook-form + yup
- CSS Modules with a design-token theme (`src/styles/theme.css`)
- oxlint

## Design

- Mockup: [Psychologists.Services (Figma)](https://www.figma.com/design/jWGFMJV27QDoiBTmMu8hZv/Psychologists.Services--Copy-?node-id=0-1)
- Technical specification: _add the link from your course dashboard here_

## Getting Started

```bash
git clone <repository-url>
cd psych-app
npm install
cp .env.example .env
npm run dev
```

Fill `.env` with your Firebase project credentials (see `.env.example`).

### Firebase setup

1. Create a Firebase project with Authentication (Email/Password provider) and
   a Realtime Database.
2. Publish the security rules from `database.rules.json` (Realtime Database →
   Rules). They make the catalog publicly readable, restrict user data to its
   owner, and define the indexes required for sorting.
3. Import `psychologists-seed.json` into the database root (Realtime Database →
   ⋮ → Import JSON).

### Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build into `dist/`
- `npm run preview` — preview the production build
- `npm run lint` — run oxlint

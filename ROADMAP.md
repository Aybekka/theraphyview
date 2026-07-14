# TheraphyView — Roadmap

Ordered by priority. Each phase leaves the app in a working, submittable state.

## Phase 1 — Correctness (the app must behave right)

- [x] Fix descending sort: use `limitToLast` + `endBefore` for `desc` queries
      instead of reversing an ascending page
- [x] Fix pagination cursor for ties: use composite cursor
      `startAfter(value, key)` so equal prices/ratings are not skipped
- [x] Fix `hasMore`: stop showing Load more after a short/empty page
- [x] Add `".indexOn": ["name", "price_per_hour", "rating"]` to Realtime
      Database rules (published from `database.rules.json`)
- [x] Expand seed data to a full psychologists.json (~30 records) so pagination
      and tie-handling are actually exercised

## Phase 2 — Submission criteria (currently failing)

- [x] Remove all code comments (AppointmentModal, usePsychologists, Favorites)
- [x] Rewrite README.md: project topic, technologies, mockup link, tech spec
      link, setup instructions
- [x] Add `.gitignore` (node_modules, dist, .env) and `.env.example`
- [x] `git init`, first commit (push to GitHub pending)
- [ ] Deploy (Netlify or Vercel — SPA redirect rule needed for React Router)

## Phase 3 — Spec deviations

- [x] Display the `license` field on the psychologist card
- [x] Unauth heart click: show an informational modal ("available for authorized
      users only") with a login button, instead of jumping straight to the login
      form
- [x] Appointment form: show a success confirmation instead of `console.info` +
      silent close
- [x] Verify responsive layout at 320 / 768 / 1440 (card meta row and header nav
      at 320px especially)

## Phase 4 — Polish

- [x] Home page hero visual (`assets/hero.jpg` from the mockup) with the green
      mockup palette
- [x] Remove unused assets (`react.svg`, `vite.svg`)
- [x] Loading states (skeletons or spinner) for Psychologists and Favorites
- [x] Optional: persist appointment requests to a `bookings` collection in
      Firebase

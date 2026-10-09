# Task Manager

A small task-manager monorepo: an Express + MongoDB API and a Vue 3 + Tailwind
single-page frontend. You can add tasks, see live stats, filter by status, and
mark tasks as completed.

## Tech stack

| Layer    | Tech                                                        |
| -------- | ----------------------------------------------------------- |
| Frontend | Vue 3 (`<script setup>`), Vite, Tailwind CSS 4, Vitest      |
| Backend  | Node.js, Express 5, Mongoose, MongoDB                       |
| Tooling  | pnpm workspaces (per-app), Docker Compose, ESLint + oxlint  |

## Project structure

```
apps/
  backend/
    src/
      index.js                      Express bootstrap + Mongo connection
      dataAccessLayer/
        dbConnection.js             Mongoose connection helper
        models/task.js              Task schema ({ title, status, timestamps })
      routes/task.js                GET/POST/PUT /tasks
  frontend/
    src/
      api/tasks.js                  fetch wrapper for the API
      composables/useTasks.js       state, filtering, stats, actions
      components/                   TaskForm, TaskList, TaskItem, TaskFilters, TaskStats
      App.vue                       page layout / wiring
```

## Setup

Prerequisites: Node 22+ and pnpm 12 (or just Docker for Mongo).

1. Start MongoDB:

   ```bash
   pnpm docker:up          # from the repo root
   ```

2. Backend:

   ```bash
   cd apps/backend
   pnpm install
   cp .env.example .env     # PORT=4001, DATABASE_URL=mongodb://localhost:27017/task-manager
   pnpm start               # nodemon on http://localhost:4001
   ```

3. Frontend (in a second terminal):

   ```bash
   cd apps/frontend
   pnpm install
   cp .env.example .env     # VITE_API_URL=http://localhost:4001
   pnpm dev                 # http://localhost:5173
   ```

4. Run the frontend tests:

   ```bash
   cd apps/frontend
   pnpm test:unit --run
   pnpm lint
   ```

### API

| Method | Path         | Body                     | Description             |
| ------ | ------------ | ------------------------ | ----------------------- |
| GET    | `/tasks`     | –                        | List all tasks          |
| POST   | `/tasks`     | `{ title, status }`      | Create a task           |
| PUT    | `/tasks/:id` | `{ status: 'done' }`     | Mark a task as complete |

Task status is an enum of `created` (pending) and `done` (completed).

## Time spent

Roughly **3.5 hours** total, based on the commit history (12:25 → 16:03):

- Backend scaffold, model, routes: ~1.5 h
- Frontend scaffold, list, form, filters, stats: ~1.5 h
- Fixing the `_id`/`id` completion bug, styling, tests, README: ~0.5 h

## Design decisions

- **Monorepo with independent apps.** `apps/backend` and `apps/frontend` keep
  their own dependencies and lockfiles, so each can evolve/deploy separately.
  Docker Compose only manages the shared MongoDB instance.
- **Backend layering.** Routes are kept thin; persistence lives in a
  `dataAccessLayer` (connection + Mongoose model) so the API layer stays testable
  and storage can change without touching route logic.
- **Status as `created`/`done`.** A two-state enum models the pending/completed
  requirement without over-engineering, and keeps the filter values aligned
  between the client and the schema.
- **Frontend state in a composable.** `useTasks` centralises loading/error
  state, derived `filteredTasks` and `stats` (via `computed`), and mutations.
  Components stay presentational and receive data through props/emits.
- **Server is the source of truth for IDs.** MongoDB returns `_id`, so the UI
  keys and matches tasks by `_id`. Completed updates use the response body and
  fall back to a local `status: 'done'` patch if the API returns an empty body.
- **`run()` wrapper.** Every API call funnels through one helper that toggles
  `loading` and normalises errors into `error`, avoiding duplicated try/catch in
  each action.
- **Tailwind + a tiny component split** (Form/List/Item/Filters/Stats) instead
  of a UI library — fast to build, no extra runtime dependency.
- **Testing with Vitest + @vue/test-utils**, mocking the API module so tests
  exercise real component/composable logic without a network or database.

## AI use

- Vue, Vite, Tailwind, and Express scaffolding followed official docs/templates.
- AI assistance (opencode) was used to review the codebase, diagnose the
  "completed task doesn't update the list" bug, and write the Vitest suites
  (`useTasks.spec.js`, `App.spec.js`).
- All generated changes were reviewed and verified by running the test suite
  and the linter locally. The architecture and feature decisions were made by
  the author.

## Possible improvements

- **Backend validation & error handling.** Return `400` for bad payloads and
  log the underlying error instead of a generic `500`.
- **Real backend tests.** Add integration tests for the routes with an
  in-memory Mongo (`mongodb-memory-server`) to complement the frontend tests.
- **Delete / edit / undo.** Only create and complete exist today; add `DELETE`
  and the ability to reopen a task.
- **Optimistic UI + concurrency.** Update the UI immediately and reconcile with
  the server; guard against duplicate submits (disable while `loading`).
- **Auth & per-user tasks.** Tasks are global right now.
- **CI pipeline.** Run lint + unit + integration tests on every PR.
- **Accessibility & UX polish.** Better button labels/`aria` states, keyboard
  submit, empty/loading skeleton states.

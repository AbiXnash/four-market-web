# four-market-web

The frontend for **Four Market**, a marketplace app: Next.js 16 (App Router), React 19, Tailwind CSS 4 and axios. It
talks to [four-market-api](https://github.com/AbiXnash/four-market-api).

## How it talks to the API

- `app/api/[...proxy]/route.ts` forwards every `/api/*` request from the browser to the backend at `BACKEND_ROUTE`,
  adding the `Client-App: 4M` header the API requires. Browsers never call the backend directly.
- `lib/client-api.ts` is the browser-side axios client. It reads `X-Application-Status` from each response and
  tells subscribers when the backend goes online or offline. `lib/app-status.tsx` shares that state with
  components.
- `app/page.tsx` checks `/api/check/app` and shows either a login form or "Backend is offline". Login isn't wired
  to the API yet.

## Configuration

`.env` (loaded with `@next/env` on the server):

```
BACKEND_ROUTE=http://localhost:8080
```

## Run it

```bash
pnpm install
pnpm dev        # or: just dev
pnpm build && pnpm start
pnpm lint
```

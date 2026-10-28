# Integration hand-off

## Services
- `services/web` — Essential; static Next.js App Router + TypeScript portfolio.
- Enhancement services: none.

## Frontend
- Folder: `services/web`
- Dev: `npm --prefix services/web run dev`
- Build: `npm --prefix services/web run build`
- Start: `npm --prefix services/web run start`
- Data wiring seam: none; all portfolio content is static.
- Mock client/data files to remove: none.

## Backend and routes
- Backend: none.
- Run/build/health commands: not applicable.
- API inventory: no API routes or endpoints.

## Database and shared types
- Database: none; migrations are not applicable.
- Explicit requirement: do not add seed data.
- Shared package/types: none.

## Link/content notes
- Verified project links: Opsfront (`https://opsfront-dakrbnt5w-yashikas-projects-76231cf3.vercel.app/#`) and Alqora (`https://alqora-demo.vercel.app`).
- Corporate Registry and Stepwise Events have no supplied destinations and are intentionally non-clickable.
- Email, phone, LinkedIn, and GitHub destinations were not present in the approved plan or `.azure/requirements.json`; do not invent them.

# mokhadesigns.com

Website for Mokha Designs (Raw Canvas), an interior design studio in Hyderabad.

## Stack

- Vite + React + TypeScript + Tailwind (shadcn/ui components)
- Hosted on Cloudflare Pages (project `mokhadesigns`), DNS on Cloudflare
- Lead form posts to a Supabase edge function (`supabase/functions/submit-contact-form`), which appends to the leads Google Sheet
- Tracking: Meta Pixel and Google Ads tag in `index.html`

## Deploys

- Push to `main` deploys to production (www.mokhadesigns.com).
- Any other branch gets a preview URL on `*.mokhadesigns.pages.dev`.
- Cloudflare build: `npm install && npm run build`, output `dist`, `NODE_VERSION=22`.

## Local development

```sh
npm install
npm run dev
```

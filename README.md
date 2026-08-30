# israel.easytech365.com

Portfolio and blog for **Israel Afolabi** — AI Engineer and AI Automation Specialist.

Live at **[israel.easytech365.com](https://israel.easytech365.com)**

---

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** with a custom token-driven design system
- **next-themes** for light/dark mode
- Deployed on **Vercel**, auto-deploying from `main`

## Local development

```bash
npm install
npm run dev
```

Then open http://localhost:3000

```bash
npm run build   # production build
npm run lint    # eslint
```

## Project layout

```
app/
  page.tsx              Home
  about/                Career timeline and bio
  services/             Service overview
  service-packages/     Pricing tiers
  projects/             Selected work
  blog/                 Blog index
  blog/[slug]/          Article pages (statically generated)
  resume/               Embedded CV
  contact/              Contact options
  globals.css           Design tokens + component styles
  sitemap.ts            Generated sitemap
  robots.ts             Generated robots.txt

components/             Navbar, Footer, Reveal, Faq, PostCta, theme toggle
lib/posts.ts            Every blog post lives here
docs/                   Operational docs
```

## Writing a blog post

All posts live in a single file: [`lib/posts.ts`](lib/posts.ts).

Add an object to the `posts` array — insert it before the closing `];` that sits above
the `/** Newest first. */` comment. The `Post` type at the top of the file documents
every field.

Things that are easy to get wrong:

- `body` is a **template literal**, so escape any backtick or `${` in the content.
- Each `toc` entry's `id` must match an `<h2 id="...">` in the body, or the link is dead.
- Wrap every table in `<div class="table-wrap">`, otherwise it breaks the mobile layout.
- `slug` must be unique.
- Don't write a call to action — [`components/PostCta.tsx`](components/PostCta.tsx) is
  appended to every post automatically, with a WhatsApp link pre-filled with the article
  title so enquiries are attributable to the post that drove them.

New posts are picked up automatically by the blog index, the sitemap, and the related-posts
links. Nothing else needs updating.

## Design system

Colours, spacing, shadows and typography are defined as CSS custom properties at the top of
[`app/globals.css`](app/globals.css), with a light set on `:root` and a dark set on `.dark`.

Two brand tokens exist deliberately and are not interchangeable:

- `--primary-fill` — background behind white text (dark enough for 4.5:1 contrast)
- `--primary-text` — brand colour used *as* text (light enough on dark surfaces)

Using `--primary` for either of those roles reintroduces contrast failures. Both themes
currently pass WCAG AA across every page.

## Automated weekly posts

[`docs/WEEKLY-BLOG-CRON-PROMPT.md`](docs/WEEKLY-BLOG-CRON-PROMPT.md) contains the master
prompt for a scheduled Claude task that researches the week's AI news, writes a post in the
house voice, and commits it here. Pushing to `main` deploys automatically.

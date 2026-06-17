# FFXIV Character Profile

A fully static, single-page character profile site for Final Fantasy XIV — built with **Next.js 15**, **TypeScript**, and **Tailwind CSS 4**.

All content is driven by a single `character.json` file. No backend, no database — just edit the JSON and deploy.

## Features

- **Themed design** — dark/light mode with auto-derived color palettes from a single accent color
- **Hero section** — character portrait, animated shooting stars, race/clan/job/server tags
- **Jobs** — level bars per role (Tank, Healer, DPS) with animated fill on scroll
- **About** — tagline + story paragraphs
- **Free Company** — crest layers, rank, server, description
- **Gallery** — horizontal carousel with lightbox viewer
- **Social Links** — Discord, Twitter, Bluesky, Twitch, Instagram, Carrd
- **RP Hooks** — optional roleplay section (enable/disable in JSON)
- **Fully customizable labels** — rename every section via `navLabels` in the JSON

## Tech Stack

- [Next.js 15](https://nextjs.org/) — App Router, `output: 'export'` (static)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Cinzel](https://fonts.google.com/specimen/Cinzel) — display font

## Getting Started

```bash
npm install
npm run dev

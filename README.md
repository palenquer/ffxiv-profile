# FFXIV Character Profile

A single-page character profile site for Final Fantasy XIV — built with **Next.js 15**, **TypeScript**, and **Tailwind CSS 4**.

Everything is driven by a single `character.json` file. No backend, no database — edit the JSON, replace the images, deploy.

---

## Quick Start

```bash
git clone https://github.com/YOUR_USERNAME/ffxiv-profile
cd ffxiv-profile
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start customizing.

---

## Customization

All customization happens in **`src/data/character.json`**.

### Basic Info

```json
{
  "name": "Your Character Name",
  "title": "Warrior of Light",
  "race": "Hyur",
  "clan": "Midlander",
  "server": "Gilgamesh",
  "datacenter": "Aether",
  "mainJob": "Paladin",
  "mainJobIcon": "PLD"
}
```

### Images

Replace the files in `public/images/`:

| File | What it is |
|---|---|
| `public/images/hero.png` | Avatar + background image |
| `public/images/gallery/image-01.png` … `image-06.png` | Gallery photos |

`heroImage` is used as the avatar circle. `heroBgImage` is the fullscreen background — set them to the same file or use different ones.

```json
{
  "heroImage": "/images/hero.png",
  "heroImageAlt": "My character portrait",
  "heroBgImage": "/images/hero.png"
}
```

> **Tip:** For best results, use a square image for `heroImage` and a wide landscape image for `heroBgImage`.

---

### Theme

```json
{
  "theme": {
    "mode": "dark",
    "accentColor": "#c8a84b",
    "animation": "shooting-stars",
    "background": {
      "baseColor": "#0d0a12",
      "lightBaseColor": "#f0eef5",
      "overlayOpacity": 0.35,
      "blur": false,
      "position": "top"
    }
  }
}
```

| Field | Options | Description |
|---|---|---|
| `mode` | `"dark"` `"light"` | Default theme on load |
| `accentColor` | Any hex color | All gold tones are derived from this single color |
| `animation` | See below | Hero background animation |
| `baseColor` | Hex | Dark mode background base |
| `lightBaseColor` | Hex | Light mode background base |
| `overlayOpacity` | `0.0` – `1.0` | How strongly the hero image shows through |
| `blur` | `true` `false` | Apply blur to the hero background |
| `position` | `"top"` `"center"` `"bottom"` | Crop position of the hero background |

**Available animations** (also listed in `_animationOptions` in the JSON):

| Value | Effect |
|---|---|
| `"shooting-stars"` | Diagonal streaks across the hero |
| `"fireflies"` | Drifting glowing orbs |
| `"sakura"` | Falling petals, lightened from your accent color |
| `"glitter"` | Twinkling 4-point sparkle stars |
| `"snow"` | Soft drifting snowflakes |
| `"aurora"` | Slow northern-lights curtain waves |
| `"bubbles"` | Rising translucent bubbles |

---

### Sections

Toggle any section on or off. Hidden sections are also removed from the navigation automatically.

```json
{
  "sections": {
    "about":   true,
    "rp":      false,
    "jobs":    true,
    "fc":      true,
    "gallery": true,
    "social":  true
  }
}
```

Rename any navigation label:

```json
{
  "navLabels": {
    "about":   "About",
    "rp":      "Character",
    "jobs":    "Jobs",
    "fc":      "Free Company",
    "gallery": "Gallery",
    "social":  "Social"
  }
}
```

---

### Jobs

List any jobs you want to show. The `icon` field must match one of the codes below.

```json
{
  "jobs": [
    { "name": "Ninja",   "icon": "NIN", "level": 100, "role": "dps"    },
    { "name": "Warrior", "icon": "WAR", "level": 90,  "role": "tank"   },
    { "name": "Scholar", "icon": "SCH", "level": 71,  "role": "healer" }
  ]
}
```

**Job icon codes:** `NIN` `BRD` `DNC` `DRG` `MCH` `MNK` `RPR` `SAM` `VPR` `BLM` `BLU` `PCT` `RDM` `SMN` `WHM` `AST` `SCH` `SGE` `DRK` `GNB` `PLD` `WAR`

---

### RP Section

Enable it with `"rp": true` in `sections`. All sub-fields are optional.

```json
{
  "rp": {
    "tags": [
      { "label": "Status",   "value": "Open for RP" },
      { "label": "Pronouns", "value": "She/Her"     },
      { "label": "Timezone", "value": "PST"         }
    ],
    "hooks": ["Wandering merchant", "Former soldier", "Lalafellin"],
    "oocNote": "DMs open for plot hooks. No ERP."
  }
}
```

---

### Free Company

```json
{
  "freeCompany": {
    "name": "Your FC Name",
    "tag": "TAG",
    "rank": "30",
    "server": "Gilgamesh",
    "datacenter": "Aether",
    "description": "Optional description shown below the FC name.",
    "crestImages": [
      "https://lds-img.finalfantasyxiv.com/YOUR_BACKGROUND.png",
      "https://img2.finalfantasyxiv.com/c/YOUR_LAYER.png"
    ]
  }
}
```

**How to get crest URLs:** Open your FC's Lodestone page → right-click each crest layer image → Copy image address. Stack up to 3 layers.

Remove the `freeCompany` field entirely to hide the section.

---

### Social Links

```json
{
  "socialLinks": [
    {
      "platform": "bluesky",
      "label": "Bluesky",
      "url": "https://bsky.app/profile/yourhandle.bsky.social",
      "username": "@yourhandle"
    }
  ]
}
```

**Supported platforms:** `discord` `carrd` `twitter` `twitch` `bluesky` `instagram`

---

### Favicon

Replace `public/favicon.ico` and `src/app/favicon.ico` with your own `.ico` file.

---

## Deployment (Vercel)

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo
3. Leave all settings as default — Vercel auto-detects Next.js
4. Click **Deploy**

Every `git push` to `main` triggers a new deployment automatically.

---

## Tech Stack

- [Next.js 15](https://nextjs.org/) App Router
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Cinzel](https://fonts.google.com/specimen/Cinzel) + [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts
- Canvas-based animations (no external animation libraries)

---

## License

MIT — use it, fork it, make it yours.

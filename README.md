# Ziqian Mo — Academic Homepage (v3.1 · Apple-inspired, denser)

Static personal academic site for [Ziqian Mo (莫子谦)](https://ziqianmo.github.io/), in the visual language of [apple.com](https://www.apple.com/): soft gray/white bands, SF-like system typography, frosted sticky nav, product-card publications, and scroll motion — tightened in **v3.1** so the page feels fuller and paper teasers are never cropped.

## Preview locally

```bash
cd ziqianmo-academic-site-v3
python3 -m http.server 8080
# open http://localhost:8080
```

Also available as `/workspace/ziqianmo-academic-site-v3.zip`.

## v3.1 changes

- **Less empty**: tighter section padding, wider content, Hero text+photo side-by-side, About facts rail, 2-column News / Publications, Honors+Service split.
- **Paper images fixed**: teasers use `object-fit: contain` on a light gray media well with landscape `aspect-ratio` (~2.25:1). No crop, no squash.
- **Richer rhythm**: focus chips in Hero, venue tags on News rows, denser research tiles.

## Design

| Token | Value |
| --- | --- |
| Backgrounds | `#ffffff` / `#f5f5f7` |
| Media well | `#ebebed` |
| Text | `#1d1d1f` / `#6e6e73` |
| Accent | `#0071e3` / `#0066cc` |
| Type | `system-ui, -apple-system, …` |
| Nav | frosted sticky `backdrop-filter: blur(20px)` |

## Motion

Hero staggered entrance · IO fade/scale reveals · rAF portrait parallax · sticky Research title on desktop · `prefers-reduced-motion` respected.

## Deploy

Copy site contents to the root of `ziqianmo.github.io` (or any static host). No build step.

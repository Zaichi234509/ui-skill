# PUCA Collab Coffee Shop Landing Page

A pixel-focused, production-ready static recreation of the provided **PUCA Collab Coffee Shop** design. The page uses semantic HTML, modern CSS, responsive layouts, tasteful hover states, and reveal-on-scroll animations to match the dark, warm, anime-inspired café aesthetic.

## Preview

Open `index.html` directly in a browser, or serve the project with a local static server.

```bash
# Option 1: open directly
open index.html

# Option 2: serve locally with Python
python3 -m http.server 5173
# then visit http://localhost:5173
```

## Project Structure

```text
.
├── index.html          # Main semantic page markup
├── styles.css          # Responsive styling, layout, theme, and animations
├── script.js           # Mobile nav, active navigation, scroll reveal behavior
├── assets/             # Generated visual assets for hero, cards, merch, and gallery
└── README.md           # Project documentation
```

## Features

- Responsive landing page for mobile, tablet, and desktop
- Dark espresso café theme with crimson highlights
- Hero section, promo notice, signature drinks, merch/events/story cards, find-us area, gallery, and footer
- Sticky-style side navigation on desktop
- Mobile hamburger menu
- Hover effects for buttons, cards, gallery images, and social links
- Intersection Observer based scroll animations
- `prefers-reduced-motion` support for accessibility
- Semantic HTML sections and accessible labels/alt text

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Google Fonts: `Cinzel` and `Inter`

## Notes

The attached design reference was recreated as a polished static web page. Imagery in `assets/` was generated to match the reference style and keep the implementation self-contained.

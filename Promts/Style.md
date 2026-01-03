# Design Overhaul Request
The current styling looks too generic and "AI-generated." I need you to completely rewrite the `styles.css` to give the project a unique, high-end "Pro Trading Terminal" personality.

# New Design Language Specs

1.  **Theme:** "Deep Dark Mode" (Not just black).
    * Background: Use a very dark gunmetal/navy (e.g., #0f172a) instead of the purple gradient.
    * Surface: Use "Glassmorphism" for cards (very low opacity white/gray with backdrop-filter: blur(10px)).
    * Borders: Thin, subtle 1px borders (rgba(255,255,255,0.1)) to define edges.

2.  **Typography:**
    * Import 'Inter' or 'Space Grotesk' from Google Fonts for headings.
    * Import 'JetBrains Mono' or 'Roboto Mono' for all data/numbers (Simulations, Prices, Balance).
    * Make numbers large and prominent.

3.  **Color Palette:**
    * Primary Action: Electric Blue or Neon Purple (for the "Run" button).
    * Success: Neon Green (not standard green).
    * Failure/Risk: Hot Pink or Bright Red.
    * Text: Off-white (#f8fafc) for high contrast, gray (#94a3b8) for labels.

4.  **UI Details (The "Personality"):**
    * **Remove:** The standard box-shadows. Replace them with subtle "Glows" (colored box-shadows with high blur) when hovering over cards.
    * **Inputs:** Style inputs to look like terminal command lines (dark background, monospace font, bottom border only).
    * **Chart:** Update the Chart.js config in `simulator.js` to use a "Grid" style (dark grid lines, hide the axes borders).

5.  **Layout:**
    * Make the "Stats Grid" at the top visually dominant (like a dashboard header).
    * Ensure the "Run Simulation" button spans the full width of the sidebar and glows on hover.

# Task
Rewrite the full `styles.css` and update any necessary JS config (for chart colors) to match this "Cyberpunk Fintech" aesthetic.
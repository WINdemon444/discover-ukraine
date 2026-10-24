# Discover Ukraine

A one-page travel guide to Ukraine with six city cards, an attractions section and a five-question trip planner that gives a personalized plan. Plain HTML, CSS and JavaScript: no build step, no database, no API keys.

## Files
- `index.html` page structure
- `style.css` styles (Ukrainian blue `#0057B7` and yellow `#FFD700`, responsive, light/dark)
- `game.css`, `game.js` Secret Hunt and the two mini-games (progress saved in localStorage)
- `script.js` city data, modals, questionnaire and recommendation logic
- `assets/images/` optional photos (see `assets/images/README.txt`); without them the site shows built-in illustrations
- `vercel.json`, `.gitignore` deployment and Git settings

## Add real photos
Run `python3 tools/fetch_images.py` on your computer (needs internet). It downloads one openly licensed Wikimedia Commons photo per image slot into `assets/images/` and writes `CREDITS.md`. Open the photos and delete any you don't like; you can also drop in your own JPGs with the same names. Any missing photo falls back to the built-in illustration.

## Run locally
Double-click `index.html`, or for a local server run `python3 -m http.server 8000` in this folder and open http://localhost:8000.

## Put it on GitHub (no Git knowledge needed)
1. Create a free account at https://github.com and click **New repository** (name it `discover-ukraine`, leave it empty).
2. On the new repo page click **uploading an existing file**, drag in everything from this folder (including `assets`), and click **Commit changes**.

With Git installed, instead run in this folder:
```
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/discover-ukraine.git
git push -u origin main
```

## Deploy on Vercel
1. Sign up at https://vercel.com with **Continue with GitHub** and approve access when asked.
2. Click **Add New → Project**, choose `discover-ukraine`, and click **Import**.
3. Leave all settings as they are (Framework Preset: Other, no build command) and click **Deploy**.
4. In about a minute you get a public `.vercel.app` link. Every later push to GitHub redeploys automatically.

## Safety notice
Always check current official travel advisories, local restrictions and air-alert information before planning travel. The site does not guarantee that any destination or route is safe or accessible.

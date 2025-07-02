# sportsHub

SportsHub is a multi-page, server-side rendered Next.js web app featuring infomration concerning all of my favorite sports teams including McLaren F1, Real Madrid, the Denver Broncos, and the New York Yankees. All data is live-scraped from the web (Wikipedia, Transfermarkt, BBC Sport, ESPN, etc.) or pulled via apis from other sources with the option to manually override incorrect information using admin controls.

## Current Features

McLaren F1 Dashboard
- Team info, current standings, and recent race results for the 2025 season
- All session data (FP1, FP2, FP3, Qualifying, Race) for the most recent race
- Data is scraped from Wikipedia; manual override available via admin

Real Madrid Dashboard
- Team summary, full squad roster (filterable), standings, recent results, and upcoming games
- Data is scraped from Transfermarkt, BBC Sport, ESPN, and Wikipedia

Admin Interface
- Preview and update all F1 and football data from the web
- Manually override and save data for F1
- Data priority: manual > web scraping > fallback

## Getting Started

1. Install dependencies using "npm install"
2. Run the development server using "npm run dev"
3. Open http://localhost:3000 in a browser of your choice

## Project Structure

- app/mclaren/page.tsx — McLaren F1 dashboard
- app/real-madrid/page.tsx — Real Madrid dashboard
- app/admin/page.tsx — Admin interface
- app/api/football/* — Real Madrid data endpoints (live-scraped)
- lib/scraper.ts — F1 data scraping logic
- lib/football-scraper.ts — Football data scraping logic

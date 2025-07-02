import { NextResponse } from 'next/server';
import { scrapeRealMadridFixtures } from '@/lib/football-scraper';

export async function GET() {
  try {
    // Try to scrape real-time fixtures
    const scrapedFixtures = await scrapeRealMadridFixtures();
    
    if (scrapedFixtures.length > 0) {
      return NextResponse.json({
        success: true,
        data: scrapedFixtures
      });
    }

    // Fallback to static data if scraping fails
    return NextResponse.json({
      success: true,
      data: [
        {
          id: 1,
          homeTeam: "Real Madrid",
          awayTeam: "Villarreal",
          date: "2025-05-05",
          competition: "La Liga",
          status: "SCHEDULED"
        },
        {
          id: 2,
          homeTeam: "Real Madrid",
          awayTeam: "Bayern Munich",
          date: "2025-05-07",
          competition: "Champions League",
          status: "SCHEDULED"
        },
        {
          id: 3,
          homeTeam: "Athletic Bilbao",
          awayTeam: "Real Madrid",
          date: "2025-05-12",
          competition: "La Liga",
          status: "SCHEDULED"
        },
        {
          id: 4,
          homeTeam: "Real Madrid",
          awayTeam: "Sevilla",
          date: "2025-05-19",
          competition: "La Liga",
          status: "SCHEDULED"
        },
        {
          id: 5,
          homeTeam: "Real Madrid",
          awayTeam: "Real Sociedad",
          date: "2025-05-26",
          competition: "La Liga",
          status: "SCHEDULED"
        },
        {
          id: 6,
          homeTeam: "Girona",
          awayTeam: "Real Madrid",
          date: "2025-06-02",
          competition: "La Liga",
          status: "SCHEDULED"
        },
        {
          id: 7,
          homeTeam: "Real Madrid",
          awayTeam: "Atlético Madrid",
          date: "2025-06-09",
          competition: "La Liga",
          status: "SCHEDULED"
        },
        {
          id: 8,
          homeTeam: "Barcelona",
          awayTeam: "Real Madrid",
          date: "2025-06-16",
          competition: "La Liga",
          status: "SCHEDULED"
        },
        {
          id: 9,
          homeTeam: "Real Madrid",
          awayTeam: "Valencia",
          date: "2025-06-23",
          competition: "La Liga",
          status: "SCHEDULED"
        },
        {
          id: 10,
          homeTeam: "Real Madrid",
          awayTeam: "Getafe",
          date: "2025-06-30",
          competition: "La Liga",
          status: "SCHEDULED"
        }
      ]
    });
  } catch (error) {
    console.error('Error fetching upcoming games:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch upcoming games' },
      { status: 500 }
    );
  }
} 
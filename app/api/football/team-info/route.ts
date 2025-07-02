import { NextResponse } from 'next/server';
import { scrapeRealMadridTeamInfo } from '@/lib/football-scraper';

export async function GET() {
  try {
    // Try to scrape real-time data
    const scrapedData = await scrapeRealMadridTeamInfo();
    
    if (scrapedData) {
      return NextResponse.json({
        success: true,
        data: {
          name: scrapedData.name,
          founded: scrapedData.founded,
          stadium: scrapedData.stadium,
          capacity: scrapedData.capacity,
          manager: scrapedData.manager,
          league: scrapedData.league,
          currentPosition: scrapedData.currentPosition,
          description: "Real Madrid Club de Fútbol, commonly referred to as Real Madrid, is a Spanish professional football club based in Madrid. Founded in 1902, the club competes in La Liga, the top tier of Spanish football.",
          trophies: {
            championsLeague: 15,
            laLiga: 36,
            copaDelRey: 20,
            supercopa: 13,
            uefaSuperCup: 5,
            clubWorldCup: 5
          }
        }
      });
    }

    // Fallback to static data if scraping fails
    return NextResponse.json({
      success: true,
      data: {
        name: "Real Madrid CF",
        founded: 1902,
        stadium: "Santiago Bernabéu",
        capacity: 81044,
        manager: "Carlo Ancelotti",
        league: "La Liga",
        currentPosition: 1,
        description: "Real Madrid Club de Fútbol, commonly referred to as Real Madrid, is a Spanish professional football club based in Madrid. Founded in 1902, the club competes in La Liga, the top tier of Spanish football.",
        trophies: {
          championsLeague: 15,
          laLiga: 36,
          copaDelRey: 20,
          supercopa: 13,
          uefaSuperCup: 5,
          clubWorldCup: 5
        }
      }
    });
  } catch (error) {
    console.error('Error fetching team info:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch team information' },
      { status: 500 }
    );
  }
} 
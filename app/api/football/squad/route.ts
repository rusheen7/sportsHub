import { NextResponse } from 'next/server';
import { scrapeRealMadridSquad } from '@/lib/football-scraper';

export async function GET() {
  try {
    // Try to scrape real-time squad data
    const scrapedPlayers = await scrapeRealMadridSquad();
    
    if (scrapedPlayers.length > 0) {
      return NextResponse.json({
        success: true,
        data: scrapedPlayers
      });
    }

    // Fallback to static data if scraping fails
    return NextResponse.json({
      success: true,
      data: [
        {
          id: 1,
          name: "Thibaut Courtois",
          position: "Goalkeeper",
          nationality: "Belgium",
          age: 32,
          shirtNumber: 1,
          goals: 0,
          assists: 0
        },
        {
          id: 2,
          name: "Dani Carvajal",
          position: "Defender",
          nationality: "Spain",
          age: 32,
          shirtNumber: 2,
          goals: 2,
          assists: 8
        },
        {
          id: 3,
          name: "Éder Militão",
          position: "Defender",
          nationality: "Brazil",
          age: 26,
          shirtNumber: 3,
          goals: 1,
          assists: 0
        },
        {
          id: 4,
          name: "David Alaba",
          position: "Defender",
          nationality: "Austria",
          age: 32,
          shirtNumber: 4,
          goals: 0,
          assists: 2
        },
        {
          id: 5,
          name: "Jude Bellingham",
          position: "Midfielder",
          nationality: "England",
          age: 21,
          shirtNumber: 5,
          goals: 23,
          assists: 13
        },
        {
          id: 6,
          name: "Aurélien Tchouaméni",
          position: "Midfielder",
          nationality: "France",
          age: 24,
          shirtNumber: 18,
          goals: 2,
          assists: 4
        },
        {
          id: 7,
          name: "Vinícius Júnior",
          position: "Forward",
          nationality: "Brazil",
          age: 23,
          shirtNumber: 7,
          goals: 24,
          assists: 11
        },
        {
          id: 8,
          name: "Toni Kroos",
          position: "Midfielder",
          nationality: "Germany",
          age: 34,
          shirtNumber: 8,
          goals: 1,
          assists: 7
        },
        {
          id: 9,
          name: "Luka Modrić",
          position: "Midfielder",
          nationality: "Croatia",
          age: 38,
          shirtNumber: 10,
          goals: 2,
          assists: 8
        },
        {
          id: 10,
          name: "Rodrygo",
          position: "Forward",
          nationality: "Brazil",
          age: 23,
          shirtNumber: 11,
          goals: 17,
          assists: 9
        },
        {
          id: 11,
          name: "Eduardo Camavinga",
          position: "Midfielder",
          nationality: "France",
          age: 21,
          shirtNumber: 12,
          goals: 1,
          assists: 3
        },
        {
          id: 12,
          name: "Andriy Lunin",
          position: "Goalkeeper",
          nationality: "Ukraine",
          age: 25,
          shirtNumber: 13,
          goals: 0,
          assists: 0
        },
        {
          id: 13,
          name: "Joselu",
          position: "Forward",
          nationality: "Spain",
          age: 34,
          shirtNumber: 14,
          goals: 17,
          assists: 3
        },
        {
          id: 14,
          name: "Federico Valverde",
          position: "Midfielder",
          nationality: "Uruguay",
          age: 25,
          shirtNumber: 15,
          goals: 1,
          assists: 8
        },
        {
          id: 15,
          name: "Antonio Rüdiger",
          position: "Defender",
          nationality: "Germany",
          age: 31,
          shirtNumber: 22,
          goals: 2,
          assists: 0
        },
        {
          id: 16,
          name: "Ferland Mendy",
          position: "Defender",
          nationality: "France",
          age: 29,
          shirtNumber: 23,
          goals: 0,
          assists: 2
        },
        {
          id: 17,
          name: "Brahim Díaz",
          position: "Midfielder",
          nationality: "Spain",
          age: 24,
          shirtNumber: 21,
          goals: 12,
          assists: 6
        },
        {
          id: 18,
          name: "Arda Güler",
          position: "Midfielder",
          nationality: "Turkey",
          age: 19,
          shirtNumber: 24,
          goals: 6,
          assists: 2
        },
        {
          id: 19,
          name: "Fran García",
          position: "Defender",
          nationality: "Spain",
          age: 24,
          shirtNumber: 20,
          goals: 0,
          assists: 3
        },
        {
          id: 20,
          name: "Kepa Arrizabalaga",
          position: "Goalkeeper",
          nationality: "Spain",
          age: 29,
          shirtNumber: 25,
          goals: 0,
          assists: 0
        }
      ]
    });
  } catch (error) {
    console.error('Error fetching squad:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch squad information' },
      { status: 500 }
    );
  }
} 
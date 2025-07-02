import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Static data for La Liga standings (2024/25 season)
    return NextResponse.json({
      success: true,
      data: [
        {
          position: 1,
          team: "Real Madrid",
          played: 38,
          won: 29,
          drawn: 8,
          lost: 1,
          goalsFor: 87,
          goalsAgainst: 26,
          points: 95,
          form: ["W", "W", "W", "W", "W"]
        },
        {
          position: 2,
          team: "Barcelona",
          played: 38,
          won: 25,
          drawn: 7,
          lost: 6,
          goalsFor: 79,
          goalsAgainst: 43,
          points: 82,
          form: ["W", "W", "L", "W", "W"]
        },
        {
          position: 3,
          team: "Girona",
          played: 38,
          won: 25,
          drawn: 6,
          lost: 7,
          goalsFor: 85,
          goalsAgainst: 46,
          points: 81,
          form: ["W", "L", "W", "W", "L"]
        },
        {
          position: 4,
          team: "Atlético Madrid",
          played: 38,
          won: 20,
          drawn: 8,
          lost: 10,
          goalsFor: 70,
          goalsAgainst: 43,
          points: 68,
          form: ["L", "W", "W", "L", "W"]
        },
        {
          position: 5,
          team: "Athletic Bilbao",
          played: 38,
          won: 19,
          drawn: 11,
          lost: 8,
          goalsFor: 62,
          goalsAgainst: 37,
          points: 68,
          form: ["W", "D", "W", "L", "W"]
        },
        {
          position: 6,
          team: "Real Sociedad",
          played: 38,
          won: 16,
          drawn: 12,
          lost: 10,
          goalsFor: 51,
          goalsAgainst: 39,
          points: 60,
          form: ["L", "W", "D", "W", "L"]
        },
        {
          position: 7,
          team: "Real Betis",
          played: 38,
          won: 14,
          drawn: 15,
          lost: 9,
          goalsFor: 48,
          goalsAgainst: 45,
          points: 57,
          form: ["D", "W", "D", "L", "W"]
        },
        {
          position: 8,
          team: "Las Palmas",
          played: 38,
          won: 12,
          drawn: 10,
          lost: 16,
          goalsFor: 37,
          goalsAgainst: 55,
          points: 46,
          form: ["L", "D", "W", "L", "D"]
        },
        {
          position: 9,
          team: "Valencia",
          played: 38,
          won: 13,
          drawn: 7,
          lost: 18,
          goalsFor: 40,
          goalsAgainst: 45,
          points: 46,
          form: ["W", "L", "L", "W", "L"]
        },
        {
          position: 10,
          team: "Getafe",
          played: 38,
          won: 10,
          drawn: 13,
          lost: 15,
          goalsFor: 37,
          goalsAgainst: 50,
          points: 43,
          form: ["D", "L", "W", "D", "L"]
        },
        {
          position: 11,
          team: "Rayo Vallecano",
          played: 38,
          won: 8,
          drawn: 16,
          lost: 14,
          goalsFor: 29,
          goalsAgainst: 41,
          points: 40,
          form: ["D", "D", "L", "W", "D"]
        },
        {
          position: 12,
          team: "Osasuna",
          played: 38,
          won: 12,
          drawn: 8,
          lost: 18,
          goalsFor: 39,
          goalsAgainst: 50,
          points: 44,
          form: ["L", "W", "L", "D", "W"]
        },
        {
          position: 13,
          team: "Villarreal",
          played: 38,
          won: 11,
          drawn: 9,
          lost: 18,
          goalsFor: 52,
          goalsAgainst: 55,
          points: 42,
          form: ["W", "L", "D", "L", "W"]
        },
        {
          position: 14,
          team: "Mallorca",
          played: 38,
          won: 8,
          drawn: 16,
          lost: 14,
          goalsFor: 31,
          goalsAgainst: 43,
          points: 40,
          form: ["D", "L", "D", "W", "D"]
        },
        {
          position: 15,
          team: "Alavés",
          played: 38,
          won: 10,
          drawn: 9,
          lost: 19,
          goalsFor: 31,
          goalsAgainst: 50,
          points: 39,
          form: ["L", "W", "L", "D", "L"]
        },
        {
          position: 16,
          team: "Sevilla",
          played: 38,
          won: 10,
          drawn: 11,
          lost: 17,
          goalsFor: 47,
          goalsAgainst: 54,
          points: 41,
          form: ["L", "D", "W", "L", "D"]
        },
        {
          position: 17,
          team: "Celta Vigo",
          played: 38,
          won: 8,
          drawn: 12,
          lost: 18,
          goalsFor: 39,
          goalsAgainst: 57,
          points: 36,
          form: ["D", "L", "W", "L", "D"]
        },
        {
          position: 18,
          team: "Cádiz",
          played: 38,
          won: 6,
          drawn: 15,
          lost: 17,
          goalsFor: 26,
          goalsAgainst: 55,
          points: 33,
          form: ["D", "L", "D", "L", "D"]
        },
        {
          position: 19,
          team: "Granada",
          played: 38,
          won: 4,
          drawn: 9,
          lost: 25,
          goalsFor: 38,
          goalsAgainst: 79,
          points: 21,
          form: ["L", "L", "D", "L", "L"]
        },
        {
          position: 20,
          team: "Almería",
          played: 38,
          won: 2,
          drawn: 11,
          lost: 25,
          goalsFor: 33,
          goalsAgainst: 67,
          points: 17,
          form: ["L", "D", "L", "L", "L"]
        }
      ]
    });
  } catch (error) {
    console.error('Error fetching standings:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch standings' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { writeDataToFile } from '../../../../lib/scraper';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { driverStandings, constructorStandings, recentRace } = await request.json();
    
    const dataDir = path.join(process.cwd(), 'data');
    const driverStandingsPath = path.join(dataDir, 'driver-standings.json');
    const constructorStandingsPath = path.join(dataDir, 'constructor-standings.json');
    const recentRacePath = path.join(dataDir, 'recent-race.json');

    // Save the data to files
    if (driverStandings) {
      writeDataToFile(driverStandingsPath, driverStandings);
    }
    
    if (constructorStandings) {
      writeDataToFile(constructorStandingsPath, constructorStandings);
    }
    
    if (recentRace) {
      writeDataToFile(recentRacePath, recentRace);
    }

    return NextResponse.json({
      success: true,
      message: "Data saved successfully"
    });
  } catch (error) {
    console.error("Error saving data:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to save data",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 
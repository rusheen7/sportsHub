import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

export interface DriverStanding {
  position: number;
  driver_name: string;
  team: string;
  points: number;
  driver_number: number;
  country_code: string;
}

export interface ConstructorStanding {
  position: number;
  team: string;
  points: number;
  wins: number;
}

export interface RaceResult {
  position: string | number;
  lap_time: string;
}

export interface DriverResults {
  fp1: RaceResult;
  fp2: RaceResult;
  fp3: RaceResult;
  sprint_qualifying: RaceResult;
  sprint: RaceResult;
  qualifying: RaceResult;
  race: RaceResult;
}

export interface RecentRaceData {
  race_name: string;
  circuit_name: string;
  date: string;
  weekend_type: "normal" | "sprint";
  mclaren_results: {
    lando_norris: DriverResults;
    oscar_piastri: DriverResults;
  };
}

// Fallback data in case all scraping fails
const fallbackDriverStandings: DriverStanding[] = [
  { position: 1, driver_name: "Oscar Piastri", team: "McLaren", points: 216, driver_number: 81, country_code: "AUS" },
  { position: 2, driver_name: "Lando Norris", team: "McLaren", points: 201, driver_number: 4, country_code: "GBR" },
  { position: 3, driver_name: "Max Verstappen", team: "Red Bull Racing", points: 155, driver_number: 1, country_code: "NED" },
  { position: 4, driver_name: "George Russell", team: "Mercedes", points: 146, driver_number: 63, country_code: "GBR" },
  { position: 5, driver_name: "Charles Leclerc", team: "Ferrari", points: 119, driver_number: 16, country_code: "MON" },
  { position: 6, driver_name: "Lewis Hamilton", team: "Ferrari", points: 91, driver_number: 44, country_code: "GBR" },
  { position: 7, driver_name: "Kimi Antonelli", team: "Mercedes", points: 63, driver_number: 47, country_code: "ITA" },
  { position: 8, driver_name: "Alexander Albon", team: "Williams", points: 42, driver_number: 23, country_code: "THA" },
  { position: 9, driver_name: "Esteban Ocon", team: "Haas", points: 23, driver_number: 31, country_code: "FRA" },
  { position: 10, driver_name: "Nico Hulkenberg", team: "Kick Sauber", points: 22, driver_number: 27, country_code: "GER" },
  { position: 11, driver_name: "Isack Hadjar", team: "Racing Bulls", points: 21, driver_number: 37, country_code: "FRA" },
  { position: 12, driver_name: "Lance Stroll", team: "Aston Martin", points: 14, driver_number: 18, country_code: "CAN" },
  { position: 13, driver_name: "Fernando Alonso", team: "Aston Martin", points: 14, driver_number: 14, country_code: "ESP" },
  { position: 14, driver_name: "Carlos Sainz", team: "Williams", points: 13, driver_number: 55, country_code: "ESP" },
  { position: 15, driver_name: "Liam Lawson", team: "Racing Bulls", points: 12, driver_number: 40, country_code: "NZL" },
  { position: 16, driver_name: "Pierre Gasly", team: "Alpine", points: 11, driver_number: 10, country_code: "FRA" },
  { position: 17, driver_name: "Yuki Tsunoda", team: "Red Bull Racing", points: 10, driver_number: 22, country_code: "JPN" },
  { position: 18, driver_name: "Oliver Bearman", team: "Haas", points: 6, driver_number: 38, country_code: "GBR" },
  { position: 19, driver_name: "Gabriel Bortoleto", team: "Kick Sauber", points: 4, driver_number: 20, country_code: "BRA" },
  { position: 20, driver_name: "Franco Colapinto", team: "Alpine", points: 0, driver_number: 12, country_code: "ARG" },
  { position: 21, driver_name: "Jack Doohan", team: "Alpine", points: 0, driver_number: 61, country_code: "AUS" },
];

const fallbackConstructorStandings: ConstructorStanding[] = [
  { position: 1, team: "McLaren", points: 417, wins: 8 },
  { position: 2, team: "Red Bull Racing", points: 165, wins: 2 },
  { position: 3, team: "Mercedes", points: 209, wins: 1 },
  { position: 4, team: "Ferrari", points: 210, wins: 0 },
  { position: 5, team: "Williams", points: 55, wins: 0 },
  { position: 6, team: "Haas", points: 29, wins: 0 },
  { position: 7, team: "Kick Sauber", points: 26, wins: 0 },
  { position: 8, team: "Racing Bulls", points: 33, wins: 0 },
  { position: 9, team: "Aston Martin", points: 28, wins: 0 },
  { position: 10, team: "Alpine", points: 11, wins: 0 },
];

const fallbackRecentRace: RecentRaceData = {
  race_name: "Austrian Grand Prix",
  circuit_name: "Red Bull Ring",
  date: "2025-06-29",
  weekend_type: "normal",
  mclaren_results: {
    lando_norris: {
      fp1: { position: "DNS", lap_time: "" },
      fp2: { position: 2, lap_time: "1:05.234" },
      fp3: { position: 1, lap_time: "1:04.987" },
      sprint_qualifying: { position: "N/A", lap_time: "N/A" },
      sprint: { position: "N/A", lap_time: "N/A" },
      qualifying: { position: 1, lap_time: "1:04.123" },
      race: { position: 1, lap_time: "1:23:47.693" }
    },
    oscar_piastri: {
      fp1: { position: 3, lap_time: "1:06.123" },
      fp2: { position: 4, lap_time: "1:05.567" },
      fp3: { position: 3, lap_time: "1:05.234" },
      sprint_qualifying: { position: "N/A", lap_time: "N/A" },
      sprint: { position: "N/A", lap_time: "N/A" },
      qualifying: { position: 3, lap_time: "1:04.456" },
      race: { position: 2, lap_time: "+2.695s" }
    }
  }
};

// Data file paths
const dataDir = path.join(process.cwd(), 'data');
const driverStandingsPath = path.join(dataDir, 'driver-standings.json');
const constructorStandingsPath = path.join(dataDir, 'constructor-standings.json');
const recentRacePath = path.join(dataDir, 'recent-race.json');
const teamInfoPath = path.join(dataDir, 'team-info.json');

// Helper function to read data from files
export function readDataFromFile<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
  }
  return fallback;
}

// Helper function to write data to files
export function writeDataToFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
}

// Scraping functions
export async function scrapeDriverStandings(): Promise<DriverStanding[]> {
  try {
    // Try Ergast API first
    const currentRes = await fetch('https://ergast.com/api/f1/current/driverStandings.json');
    if (currentRes.ok) {
      const data = await currentRes.json();
      const standings = data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings;
      
      if (standings && standings.length > 0) {
        return standings.map((standing: any) => ({
          position: parseInt(standing.position),
          driver_name: `${standing.Driver.givenName} ${standing.Driver.familyName}`,
          team: standing.Constructors[0]?.name || "Unknown Team",
          points: parseInt(standing.points),
          driver_number: parseInt(standing.Driver.permanentNumber) || 0,
          country_code: standing.Driver.nationality
        }));
      }
    }

    // Try 2024 season if current fails
    const res2024 = await fetch('https://ergast.com/api/f1/2024/driverStandings.json');
    if (res2024.ok) {
      const data = await res2024.json();
      const standings = data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings;
      
      if (standings && standings.length > 0) {
        return standings.map((standing: any) => ({
          position: parseInt(standing.position),
          driver_name: `${standing.Driver.givenName} ${standing.Driver.familyName}`,
          team: standing.Constructors[0]?.name || "Unknown Team",
          points: parseInt(standing.points),
          driver_number: parseInt(standing.Driver.permanentNumber) || 0,
          country_code: standing.Driver.nationality
        }));
      }
    }

    // Try Wikipedia scraping
    const response = await fetch('https://en.wikipedia.org/wiki/2025_Formula_One_World_Championship');
    const html = await response.text();
    const $ = cheerio.load(html);

    const drivers: DriverStanding[] = [];
    
    $('table.wikitable').each((i, table) => {
      const $table = $(table);
      const caption = $table.find('caption').text().toLowerCase();
      
      if (caption.includes('driver') && caption.includes('standings')) {
        $table.find('tr').each((j, row) => {
          const $row = $(row);
          const cells = $row.find('td');
          
          if (cells.length >= 4) {
            const position = parseInt($(cells[0]).text().trim());
            const driverName = $(cells[1]).text().trim();
            const nationality = $(cells[2]).text().trim();
            const team = $(cells[3]).text().trim();
            const points = parseInt($(cells[4]).text().trim()) || 0;
            
            if (position && driverName && !isNaN(position)) {
              const driverNumberMatch = driverName.match(/#(\d+)/);
              const driverNumber = driverNumberMatch ? parseInt(driverNumberMatch[1]) : 0;
              const cleanDriverName = driverName.replace(/#\d+/, '').trim();
              
              drivers.push({
                position,
                driver_name: cleanDriverName,
                team,
                points,
                driver_number: driverNumber,
                country_code: nationality
              });
            }
          }
        });
      }
    });

    if (drivers.length > 0) {
      return drivers;
    }

    return fallbackDriverStandings;
  } catch (error) {
    console.error("Error scraping driver standings:", error);
    return fallbackDriverStandings;
  }
}

export async function scrapeConstructorStandings(): Promise<ConstructorStanding[]> {
  try {
    // Try Ergast API first
    const currentRes = await fetch('https://ergast.com/api/f1/current/constructorStandings.json');
    if (currentRes.ok) {
      const data = await currentRes.json();
      const standings = data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings;
      
      if (standings && standings.length > 0) {
        return standings.map((standing: any) => ({
          position: parseInt(standing.position),
          team: standing.Constructor.name,
          points: parseInt(standing.points),
          wins: parseInt(standing.wins) || 0
        }));
      }
    }

    // Try 2024 season if current fails
    const res2024 = await fetch('https://ergast.com/api/f1/2024/constructorStandings.json');
    if (res2024.ok) {
      const data = await res2024.json();
      const standings = data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings;
      
      if (standings && standings.length > 0) {
        return standings.map((standing: any) => ({
          position: parseInt(standing.position),
          team: standing.Constructor.name,
          points: parseInt(standing.points),
          wins: parseInt(standing.wins) || 0
        }));
      }
    }

    // Try Wikipedia scraping
    const response = await fetch('https://en.wikipedia.org/wiki/2025_Formula_One_World_Championship');
    const html = await response.text();
    const $ = cheerio.load(html);

    const constructors: ConstructorStanding[] = [];
    
    $('table.wikitable').each((i, table) => {
      const $table = $(table);
      const caption = $table.find('caption').text().toLowerCase();
      
      if (caption.includes('constructor') && caption.includes('standings')) {
        $table.find('tr').each((j, row) => {
          const $row = $(row);
          const cells = $row.find('td');
          
          if (cells.length >= 3) {
            const position = parseInt($(cells[0]).text().trim());
            const team = $(cells[1]).text().trim();
            const points = parseInt($(cells[2]).text().trim()) || 0;
            
            if (position && team && !isNaN(position)) {
              constructors.push({
                position,
                team,
                points,
                wins: 0 // Wikipedia doesn't always have wins data
              });
            }
          }
        });
      }
    });

    if (constructors.length > 0) {
      return constructors;
    }

    return fallbackConstructorStandings;
  } catch (error) {
    console.error("Error scraping constructor standings:", error);
    return fallbackConstructorStandings;
  }
}

export async function scrapeRecentRace(): Promise<RecentRaceData> {
  try {
    // 1. Load the 2025 F1 season Wikipedia page
    const seasonUrl = 'https://en.wikipedia.org/wiki/2025_Formula_One_World_Championship';
    const seasonRes = await fetch(seasonUrl);
    if (!seasonRes.ok) throw new Error('Failed to fetch season page');
    const seasonHtml = await seasonRes.text();
    const $season = cheerio.load(seasonHtml);

    // 2. Find the most recent race (by date <= today)
    const today = new Date();
    let mostRecentRace: string = '';
    let mostRecentDate: Date | null = null;
    let mostRecentRaceLink: string = '';
    $season('table.wikitable:contains("Grand Prix")').first().find('tr').each((i: number, row: any) => {
      const cells = $season(row).find('td');
      if (cells.length >= 5) {
        const raceName = $season(cells[1]).text().trim();
        const dateText = $season(cells[2]).text().trim();
        // Parse date (format: 29 June 2025)
        const dateMatch = dateText.match(/(\d{1,2}) ([A-Za-z]+) (\d{4})/);
        if (dateMatch) {
          const [_, day, month, year] = dateMatch;
          const dateObj = new Date(`${month} ${day}, ${year}`);
          if (dateObj <= today && (!mostRecentDate || dateObj > mostRecentDate)) {
            mostRecentDate = dateObj;
            mostRecentRace = raceName;
            // Find the link to the race page
            const link = $season(cells[1]).find('a').attr('href');
            if (link) {
              mostRecentRaceLink = 'https://en.wikipedia.org' + link;
            }
          }
        }
      }
    });

    if (!mostRecentRaceLink) throw new Error('Could not find most recent race link');

    // 3. Scrape the most recent race page
    const raceRes = await fetch(mostRecentRaceLink);
    if (!raceRes.ok) throw new Error('Failed to fetch race page');
    const raceHtml = await raceRes.text();
    const $race = cheerio.load(raceHtml);

    // 4. Parse sessions: FP1, FP2, FP3, Qualifying, Race
    // We'll look for tables with session names in their captions
    type SessionKey = 'fp1' | 'fp2' | 'fp3' | 'qualifying' | 'race' | 'sprint_qualifying' | 'sprint';
    const sessionMap: Record<SessionKey, { position: string | number; lap_time: string }> = {
      fp1: { position: 'N/A', lap_time: 'N/A' },
      fp2: { position: 'N/A', lap_time: 'N/A' },
      fp3: { position: 'N/A', lap_time: 'N/A' },
      qualifying: { position: 'N/A', lap_time: 'N/A' },
      race: { position: 'N/A', lap_time: 'N/A' },
      sprint_qualifying: { position: 'N/A', lap_time: 'N/A' },
      sprint: { position: 'N/A', lap_time: 'N/A' },
    };
    const mclarenResults: Record<'lando_norris' | 'oscar_piastri', Record<SessionKey, { position: string | number; lap_time: string }>> = {
      lando_norris: { ...sessionMap },
      oscar_piastri: { ...sessionMap },
    };

    // Helper to match driver names
    function isLando(name: string) {
      return /lando\s+norris/i.test(name);
    }
    function isOscar(name: string) {
      return /oscar\s+piastri/i.test(name);
    }

    // Helper to parse session tables
    function parseSessionTable($table: cheerio.Cheerio<any>, session: SessionKey) {
      $table.find('tr').each((i: number, row: any) => {
        const cells = $race(row).find('td');
        if (cells.length >= 3) {
          const posText = $race(cells[0]).text().trim();
          const name = $race(cells[1]).text().trim();
          const time = $race(cells[2]).text().trim();
          if (isLando(name)) {
            mclarenResults.lando_norris[session] = { position: posText || 'N/A', lap_time: time || '' };
          } else if (isOscar(name)) {
            mclarenResults.oscar_piastri[session] = { position: posText || 'N/A', lap_time: time || '' };
          }
        }
      });
    }

    // Find and parse each session table
    $race('table.wikitable').each((i: number, table: any) => {
      const $table = $race(table);
      const caption = $table.find('caption').text().toLowerCase();
      if (caption.includes('practice 1')) parseSessionTable($table, 'fp1');
      if (caption.includes('practice 2')) parseSessionTable($table, 'fp2');
      if (caption.includes('practice 3')) parseSessionTable($table, 'fp3');
      if (caption.includes('qualifying')) parseSessionTable($table, 'qualifying');
      if (caption.includes('race result') || caption.includes('grand prix')) {
        // Race table: try to get position and time/interval
        $table.find('tr').each((i: number, row: any) => {
          const cells = $race(row).find('td');
          if (cells.length >= 7) {
            const posText = $race(cells[0]).text().trim();
            const name = $race(cells[2]).text().trim();
            const time = $race(cells[6]).text().trim();
            if (isLando(name)) {
              mclarenResults.lando_norris.race = { position: posText || 'N/A', lap_time: time || '' };
            } else if (isOscar(name)) {
              mclarenResults.oscar_piastri.race = { position: posText || 'N/A', lap_time: time || '' };
            }
          }
        });
      }
    });

    // 5. Get circuit name and date from the infobox
    let circuitName = '';
    let date = '';
    $race('table.infobox').first().find('tr').each((i: number, row: any) => {
      const th = $race(row).find('th').text().toLowerCase();
      const td = $race(row).find('td').text().trim();
      if (th.includes('course') || th.includes('circuit')) circuitName = td;
      if (th.includes('date')) date = td;
    });
    if (!circuitName) circuitName = mostRecentRace;
    if (!date) date = (mostRecentDate !== null) ? (mostRecentDate as Date).toISOString().slice(0, 10) : '';

    // 6. Return the structured data
    return {
      race_name: mostRecentRace,
      circuit_name: circuitName,
      date: date,
      weekend_type: 'normal', // Could be improved if sprint detected
      mclaren_results: mclarenResults,
    };
  } catch (error) {
    console.error('Error scraping recent race data:', error);
    return fallbackRecentRace;
  }
}

function getDefaultDriverResults(): DriverResults {
  return {
    fp1: { position: "N/A", lap_time: "N/A" },
    fp2: { position: "N/A", lap_time: "N/A" },
    fp3: { position: "N/A", lap_time: "N/A" },
    sprint_qualifying: { position: "N/A", lap_time: "N/A" },
    sprint: { position: "N/A", lap_time: "N/A" },
    qualifying: { position: "N/A", lap_time: "N/A" },
    race: { position: "N/A", lap_time: "N/A" }
  };
}

// Main scraping function that updates all data
export async function updateAllData(): Promise<{
  driverStandings: DriverStanding[];
  constructorStandings: ConstructorStanding[];
  recentRace: RecentRaceData;
}> {
  console.log("Starting data update...");
  
  const [driverStandings, constructorStandings, recentRace] = await Promise.all([
    scrapeDriverStandings(),
    scrapeConstructorStandings(),
    scrapeRecentRace()
  ]);

  // Write to files
  writeDataToFile(driverStandingsPath, driverStandings);
  writeDataToFile(constructorStandingsPath, constructorStandings);
  writeDataToFile(recentRacePath, recentRace);

  console.log("Data update completed");
  
  return {
    driverStandings,
    constructorStandings,
    recentRace
  };
}

// Function to get current data (from files or fallback)
export function getCurrentData() {
  return {
    driverStandings: readDataFromFile(driverStandingsPath, fallbackDriverStandings),
    constructorStandings: readDataFromFile(constructorStandingsPath, fallbackConstructorStandings),
    recentRace: readDataFromFile(recentRacePath, fallbackRecentRace),
    teamInfo: readDataFromFile(teamInfoPath, {
      strTeam: "McLaren F1 Team",
      strSport: "Formula 1",
      strLeague: "Formula 1 World Championship",
      strCountry: "United Kingdom",
      strWebsite: "mclaren.com",
      strDescriptionEN: "McLaren Racing Limited is a British motor racing team based at the McLaren Technology Centre, Woking, Surrey, England. McLaren is best known as a Formula One constructor and also has a history of competing in American open wheel racing as both an entrant and a chassis constructor, and has won the Canadian-American Challenge Cup (Can-Am) sports car racing championship. The team is the second oldest active team and one of the most successful teams in Formula One, having won 183 races, 12 Drivers' Championships and 8 Constructors' Championships."
    })
  };
}

// Function to get data with priority: Manual data > Web scraping > Fallback
export async function getDataWithPriority(): Promise<{
  driverStandings: DriverStanding[];
  constructorStandings: ConstructorStanding[];
  recentRace: RecentRaceData;
}> {
  // First, check if there's manually saved data
  const manualDriverStandings = readDataFromFile(driverStandingsPath, null);
  const manualConstructorStandings = readDataFromFile(constructorStandingsPath, null);
  const manualRecentRace = readDataFromFile(recentRacePath, null);

  // If we have manually saved data, use it
  if (manualDriverStandings && manualConstructorStandings && manualRecentRace) {
    console.log("Using manually saved data (admin override)");
    return {
      driverStandings: manualDriverStandings,
      constructorStandings: manualConstructorStandings,
      recentRace: manualRecentRace
    };
  }

  // Otherwise, try web scraping
  console.log("No manual data found, using web scraping");
  return await updateAllData();
} 
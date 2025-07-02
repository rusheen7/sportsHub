// app/mclaren/page.tsx
export const dynamic = 'force-dynamic';

import clsx from "clsx";

interface Driver {
  position: number;
  driver_name: string;
  team: string;
  points: number;
  driver_number: number;
  country_code: string;
}

interface Constructor {
  position: number;
  team: string;
  points: number;
  wins: number;
}

interface RaceResult {
  position: number | string;
  lap_time: string;
}

interface DriverResults {
  fp1: RaceResult;
  fp2: RaceResult;
  fp3: RaceResult;
  sprint_qualifying: RaceResult;
  sprint: RaceResult;
  qualifying: RaceResult;
  race: RaceResult;
}

interface RecentRace {
  race_name: string;
  circuit_name: string;
  date: string;
  weekend_type: "normal" | "sprint";
  mclaren_results: {
    lando_norris: DriverResults;
    oscar_piastri: DriverResults;
  };
}

interface TeamInfo {
  strTeam: string;
  strSport: string;
  strLeague: string;
  strCountry: string;
  strWebsite: string;
  strDescriptionEN: string;
}

export default async function McLarenPage() {
  // Fetch all data from admin API
  const dataRes = await fetch("http://localhost:3000/api/admin/update", { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'preview' }),
    cache: "no-store" 
  });
  const result = await dataRes.json();
  
  if (!result.success) {
    throw new Error('Failed to fetch data');
  }
  
  const data = result.data;
  const team = {
    strTeam: "McLaren F1 Team",
    strSport: "Formula 1",
    strLeague: "Formula 1 World Championship",
    strCountry: "United Kingdom",
    strWebsite: "mclaren.com",
    strDescriptionEN: "McLaren Racing Limited is a British motor racing team based at the McLaren Technology Centre, Woking, Surrey, England. McLaren is best known as a Formula One constructor and also has a history of competing in American open wheel racing as both an entrant and a chassis constructor, and has won the Canadian-American Challenge Cup (Can-Am) sports car racing championship. The team is the second oldest active team and one of the most successful teams in Formula One, having won 183 races, 12 Drivers' Championships and 8 Constructors' Championships."
  };
  const driverStandingsData: Driver[] = data.driverStandings;
  const constructorData: Constructor[] = data.constructorStandings;
  const recentRaceData: RecentRace = data.recentRace;

  // Filter McLaren drivers from standings
  const mclarenDrivers = driverStandingsData?.filter((driver: Driver) => 
    driver.team.toLowerCase().includes("mclaren")
  ) || [];

  // Helper function to render session results
  const displayPosition = (pos: string | number) => {
    if (!pos && pos !== 0) return "";
    return /^\d+$/.test(String(pos)) ? `P${pos}` : pos;
  };

  const renderSessionResult = (session: keyof DriverResults, driver: 'lando_norris' | 'oscar_piastri') => {
    const result = recentRaceData.mclaren_results[driver][session];
    const sessionName = session.replace('_', ' ').toUpperCase();
    
    return (
      <div className="bg-gray-50 p-2 rounded">
        <span className="font-semibold">{sessionName}:</span> {displayPosition(result.position)} ({result.lap_time})
      </div>
    );
  };

  // Get sessions to display based on weekend type
  const getSessionsForWeekend = (weekendType: "normal" | "sprint") => {
    if (weekendType === "sprint") {
      return ['fp1', 'sprint_qualifying', 'sprint', 'qualifying', 'race'] as const;
    } else {
      return ['fp1', 'fp2', 'fp3', 'qualifying', 'race'] as const;
    }
  };

  return (
    <main className="min-h-screen p-8 bg-orange-50">
      {/* Team Info */}
      <h1 className="text-4xl font-bold text-orange-600 mb-4">{team?.strTeam}</h1>

      {team && (
        <section className="mb-8">
          <p><strong>Sport:</strong> {team.strSport}</p>
          <p><strong>League:</strong> {team.strLeague}</p>
          <p><strong>Country:</strong> {team.strCountry}</p>
          <p><strong>Website:</strong>{' '}
            <a href={`https://${team.strWebsite}`} target="_blank" className="text-blue-600 hover:underline">
              {team.strWebsite}
            </a>
          </p>
          <p className="mt-4 text-gray-700 max-w-xl">{team.strDescriptionEN}</p>
        </section>
      )}

      {/* Constructor Standings */}
      {constructorData?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Constructor Standings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {constructorData.map((team: Constructor, i: number) => (
              <div
                key={i}
                className={clsx(
                  "p-4 border rounded-lg shadow-sm transition-all",
                  team.team.toLowerCase().includes("mclaren") 
                    ? "bg-orange-200 border-orange-500 shadow-md scale-105" 
                    : "bg-white hover:shadow-md"
                )}
              >
                <div className="text-center">
                  <div className={clsx(
                    "text-2xl font-bold mb-2",
                    team.team.toLowerCase().includes("mclaren") ? "text-orange-700" : "text-gray-700"
                  )}>
                    {team.position}
                  </div>
                  <p className="font-semibold text-sm">{team.team}</p>
                  <p className="text-lg font-bold text-blue-600">{team.points} pts</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* McLaren Drivers */}
      {mclarenDrivers?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">McLaren Drivers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mclarenDrivers.map((driver: Driver, i: number) => (
              <div key={i} className="p-6 bg-white shadow-lg rounded-lg border-l-4 border-orange-500">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{driver.driver_name}</h3>
                    <p className="text-sm text-gray-600">#{driver.driver_number}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">{displayPosition(driver.position)}</div>
                    <p className="text-sm text-gray-600">{driver.country_code}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-lg font-semibold text-blue-600">{driver.points} points</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Driver Standings */}
      {driverStandingsData?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Driver Standings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {driverStandingsData.map((driver: Driver, i: number) => (
              <div
                key={i}
                className={clsx(
                  "p-3 border rounded-lg shadow-sm transition-all",
                  driver.team.toLowerCase().includes("mclaren") 
                    ? "bg-orange-200 border-orange-500 shadow-md scale-105" 
                    : "bg-white hover:shadow-md"
                )}
              >
                <div className="text-center">
                  <div className={clsx(
                    "text-xl font-bold mb-1",
                    driver.team.toLowerCase().includes("mclaren") ? "text-orange-700" : "text-gray-700"
                  )}>
                    {displayPosition(driver.position)}
                  </div>
                  <p className="font-semibold text-xs mb-1">{driver.driver_name}</p>
                  <p className="text-xs text-gray-600 mb-1">#{driver.driver_number}</p>
                  <p className="text-sm font-bold text-blue-600">{driver.points} pts</p>
                  <p className="text-xs text-gray-500">{driver.team}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Race Weekend */}
      {recentRaceData && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Most Recent Race Weekend</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-800">{recentRaceData.race_name}</h3>
              <p className="text-gray-600">
                {recentRaceData.circuit_name} • {recentRaceData.date}
                <span className={clsx(
                  "ml-2 px-2 py-1 rounded text-xs font-medium",
                  recentRaceData.weekend_type === "sprint" 
                    ? "bg-purple-100 text-purple-800" 
                    : "bg-blue-100 text-blue-800"
                )}>
                  {recentRaceData.weekend_type === "sprint" ? "Sprint Weekend" : "Normal Weekend"}
                </span>
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lando Norris Results */}
              <div className="border rounded-lg p-4">
                <h4 className="text-lg font-semibold mb-3 text-orange-600">Lando Norris</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {getSessionsForWeekend(recentRaceData.weekend_type).map((session) => (
                    <div key={session}>
                      {renderSessionResult(session, 'lando_norris')}
                    </div>
                  ))}
                </div>
              </div>

              {/* Oscar Piastri Results */}
              <div className="border rounded-lg p-4">
                <h4 className="text-lg font-semibold mb-3 text-orange-600">Oscar Piastri</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {getSessionsForWeekend(recentRaceData.weekend_type).map((session) => (
                    <div key={session}>
                      {renderSessionResult(session, 'oscar_piastri')}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
'use client';

import { useState, useEffect } from 'react';

interface DriverStanding {
  position: number;
  driver_name: string;
  team: string;
  points: number;
  driver_number: number;
  country_code: string;
}

interface ConstructorStanding {
  position: number;
  team: string;
  points: number;
  wins: number;
}

interface RaceResult {
  position: string | number;
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

interface RecentRaceData {
  race_name: string;
  circuit_name: string;
  date: string;
  weekend_type: "normal" | "sprint";
  mclaren_results: {
    lando_norris: DriverResults;
    oscar_piastri: DriverResults;
  };
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'drivers' | 'constructors' | 'race' | 'football'>('drivers');
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);
  const [constructorStandings, setConstructorStandings] = useState<ConstructorStanding[]>([]);
  const [recentRace, setRecentRace] = useState<RecentRaceData | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Load current data on component mount
  useEffect(() => {
    loadCurrentData();
  }, []);

  const loadCurrentData = async () => {
    try {
      const response = await fetch('/api/admin/update');
      const result = await response.json();
      
      if (result.success) {
        setDriverStandings(result.data.driverStandings);
        setConstructorStandings(result.data.constructorStandings);
        setRecentRace(result.data.recentRace);
      }
    } catch (error) {
      console.error('Error loading current data:', error);
    }
  };

  const updateDriverStanding = (index: number, field: keyof DriverStanding, value: any) => {
    const updated = [...driverStandings];
    updated[index] = { ...updated[index], [field]: value };
    setDriverStandings(updated);
  };

  const updateConstructorStanding = (index: number, field: keyof ConstructorStanding, value: any) => {
    const updated = [...constructorStandings];
    updated[index] = { ...updated[index], [field]: value };
    setConstructorStandings(updated);
  };

  const updateRaceResult = (driver: 'lando_norris' | 'oscar_piastri', session: keyof DriverResults, field: keyof RaceResult, value: any) => {
    if (!recentRace) return;
    const updated = { ...recentRace };
    updated.mclaren_results[driver][session] = { 
      ...updated.mclaren_results[driver][session], 
      [field]: value 
    };
    setRecentRace(updated);
  };

  const scrapeData = async (action: 'preview' | 'save') => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/admin/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });

      const result = await response.json();
      
      if (result.success) {
        if (action === 'preview') {
          setPreviewData(result.data);
          setShowPreview(true);
          setMessage('Preview generated successfully! Review the data below.');
        } else {
          setDriverStandings(result.data.driverStandings);
          setConstructorStandings(result.data.constructorStandings);
          setRecentRace(result.data.recentRace);
          setMessage('Data updated and saved successfully!');
        }
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      setMessage('Error updating data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const scrapeFootballData = async (action: 'preview' | 'save') => {
    setIsLoading(true);
    setMessage('');
    
    try {
      // Test the football API endpoints to trigger scraping
      const endpoints = [
        '/api/football/team-info',
        '/api/football/squad',
        '/api/football/standings',
        '/api/football/recent-results',
        '/api/football/upcoming-games'
      ];

      const results = await Promise.all(
        endpoints.map(endpoint => fetch(endpoint).then(res => res.json()))
      );

      const allSuccessful = results.every(result => result.success);
      
      if (allSuccessful) {
        if (action === 'preview') {
          setMessage('Football data preview generated successfully! Data is being scraped from live sources.');
        } else {
          setMessage('Football data updated successfully! All endpoints refreshed with latest scraped data.');
        }
      } else {
        setMessage('Some football data endpoints failed to update. Check console for details.');
      }
    } catch (error) {
      setMessage('Error updating football data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveManualData = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverStandings,
          constructorStandings,
          recentRace
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage('Manual data saved successfully!');
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      setMessage('Error saving data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const applyPreviewData = () => {
    if (previewData) {
      setDriverStandings(previewData.driverStandings);
      setConstructorStandings(previewData.constructorStandings);
      setRecentRace(previewData.recentRace);
      setShowPreview(false);
      setPreviewData(null);
      setMessage('Preview data applied! Click "Save Manual Data" to save.');
    }
  };

  const isSpecialPosition = (pos: string | number) => {
    return ["DNS", "N/A", "DNF", "DSQ", "RET", "DNSP"].includes(String(pos).toUpperCase());
  };

  const displayPosition = (pos: string | number) => {
    if (!pos) return "";
    // Only prepend "P" if pos is a number
    return /^\d+$/.test(String(pos)) ? `P${pos}` : pos;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">SportsHub Admin</h1>
        
        {message && (
          <div className={`p-4 mb-6 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        {/* Scraping Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Data Management</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => scrapeData('preview')}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Preview from Web'}
            </button>
            <button
              onClick={() => scrapeData('save')}
              disabled={isLoading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Update from Web'}
            </button>
            <button
              onClick={saveManualData}
              disabled={isLoading}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Manual Data'}
            </button>
          </div>
        </div>

        {/* Preview Data */}
        {showPreview && previewData && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-800">Preview Data from Web</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-4 rounded">
                <h4 className="font-semibold mb-2">Driver Standings</h4>
                <p className="text-sm text-gray-600">{previewData.driverStandings.length} drivers</p>
                <p className="text-sm text-gray-600">Top: {previewData.driverStandings[0]?.driver_name}</p>
              </div>
              <div className="bg-white p-4 rounded">
                <h4 className="font-semibold mb-2">Constructor Standings</h4>
                <p className="text-sm text-gray-600">{previewData.constructorStandings.length} teams</p>
                <p className="text-sm text-gray-600">Top: {previewData.constructorStandings[0]?.team}</p>
              </div>
              <div className="bg-white p-4 rounded">
                <h4 className="font-semibold mb-2">Recent Race</h4>
                <p className="text-sm text-gray-600">{previewData.recentRace.race_name}</p>
                <p className="text-sm text-gray-600">{previewData.recentRace.date}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={applyPreviewData}
                className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700"
              >
                Apply Preview Data
              </button>
              <button
                onClick={() => {
                  setShowPreview(false);
                  setPreviewData(null);
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded font-medium hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'drivers', label: 'Driver Standings' },
                { id: 'constructors', label: 'Constructor Standings' },
                { id: 'race', label: 'Recent Race' },
                { id: 'football', label: 'Football Data' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'drivers' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Driver Standings</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Pos</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Driver</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Points</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Number</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {driverStandings.map((driver, index) => (
                        <tr key={index} className={driver.team === "McLaren" ? "bg-orange-50" : ""}>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={driver.position}
                              onChange={(e) => updateDriverStanding(index, 'position', parseInt(e.target.value))}
                              className="w-12 border border-gray-300 rounded px-2 py-1"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={driver.driver_name}
                              onChange={(e) => updateDriverStanding(index, 'driver_name', e.target.value)}
                              className="w-32 border border-gray-300 rounded px-2 py-1"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={driver.team}
                              onChange={(e) => updateDriverStanding(index, 'team', e.target.value)}
                              className="w-32 border border-gray-300 rounded px-2 py-1"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={driver.points}
                              onChange={(e) => updateDriverStanding(index, 'points', parseInt(e.target.value))}
                              className="w-16 border border-gray-300 rounded px-2 py-1"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={driver.driver_number}
                              onChange={(e) => updateDriverStanding(index, 'driver_number', parseInt(e.target.value))}
                              className="w-16 border border-gray-300 rounded px-2 py-1"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={driver.country_code}
                              onChange={(e) => updateDriverStanding(index, 'country_code', e.target.value)}
                              className="w-16 border border-gray-300 rounded px-2 py-1"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'constructors' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Constructor Standings</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Pos</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Points</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Wins</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {constructorStandings.map((constructor, index) => (
                        <tr key={index} className={constructor.team === "McLaren" ? "bg-orange-50" : ""}>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={constructor.position}
                              onChange={(e) => updateConstructorStanding(index, 'position', parseInt(e.target.value))}
                              className="w-12 border border-gray-300 rounded px-2 py-1"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={constructor.team}
                              onChange={(e) => updateConstructorStanding(index, 'team', e.target.value)}
                              className="w-32 border border-gray-300 rounded px-2 py-1"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={constructor.points}
                              onChange={(e) => updateConstructorStanding(index, 'points', parseInt(e.target.value))}
                              className="w-16 border border-gray-300 rounded px-2 py-1"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={constructor.wins}
                              onChange={(e) => updateConstructorStanding(index, 'wins', parseInt(e.target.value))}
                              className="w-16 border border-gray-300 rounded px-2 py-1"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'race' && recentRace && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Recent Race Data</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Race Name</label>
                    <input
                      type="text"
                      value={recentRace.race_name}
                      onChange={(e) => setRecentRace({...recentRace, race_name: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Circuit Name</label>
                    <input
                      type="text"
                      value={recentRace.circuit_name}
                      onChange={(e) => setRecentRace({...recentRace, circuit_name: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="text"
                      value={recentRace.date}
                      onChange={(e) => setRecentRace({...recentRace, date: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      placeholder="YYYY-MM-DD"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weekend Type</label>
                    <select
                      value={recentRace.weekend_type}
                      onChange={(e) => setRecentRace({...recentRace, weekend_type: e.target.value as "normal" | "sprint"})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                      <option value="normal">Normal Weekend</option>
                      <option value="sprint">Sprint Weekend</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Lando Norris */}
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-blue-600">Lando Norris</h3>
                    <div className="space-y-3">
                      {(['fp1', 'fp2', 'fp3', 'sprint_qualifying', 'sprint', 'qualifying', 'race'] as const).map((session) => {
                        const pos = recentRace.mclaren_results.lando_norris[session].position;
                        const lap = recentRace.mclaren_results.lando_norris[session].lap_time;
                        return (
                          <div key={session} className="flex items-center space-x-2">
                            <span className="w-24 text-sm font-medium capitalize">{session.replace('_', ' ')}:</span>
                            <input
                              type="text"
                              placeholder="Position"
                              value={displayPosition(pos)}
                              onChange={e => {
                                const value = e.target.value;
                                updateRaceResult('lando_norris', session, 'position', value);
                                if (isSpecialPosition(value)) {
                                  updateRaceResult('lando_norris', session, 'lap_time', '');
                                }
                              }}
                              className="w-16 border border-gray-300 rounded px-2 py-1"
                            />
                            <input
                              type="text"
                              placeholder="Lap Time"
                              value={lap}
                              onChange={e => updateRaceResult('lando_norris', session, 'lap_time', e.target.value)}
                              className="w-24 border border-gray-300 rounded px-2 py-1"
                              disabled={isSpecialPosition(pos)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Oscar Piastri */}
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-blue-600">Oscar Piastri</h3>
                    <div className="space-y-3">
                      {(['fp1', 'fp2', 'fp3', 'sprint_qualifying', 'sprint', 'qualifying', 'race'] as const).map((session) => {
                        const pos = recentRace.mclaren_results.oscar_piastri[session].position;
                        const lap = recentRace.mclaren_results.oscar_piastri[session].lap_time;
                        return (
                          <div key={session} className="flex items-center space-x-2">
                            <span className="w-24 text-sm font-medium capitalize">{session.replace('_', ' ')}:</span>
                            <input
                              type="text"
                              placeholder="Position"
                              value={displayPosition(pos)}
                              onChange={e => {
                                const value = e.target.value;
                                updateRaceResult('oscar_piastri', session, 'position', value);
                                if (isSpecialPosition(value)) {
                                  updateRaceResult('oscar_piastri', session, 'lap_time', '');
                                }
                              }}
                              className="w-16 border border-gray-300 rounded px-2 py-1"
                            />
                            <input
                              type="text"
                              placeholder="Lap Time"
                              value={lap}
                              onChange={e => updateRaceResult('oscar_piastri', session, 'lap_time', e.target.value)}
                              className="w-24 border border-gray-300 rounded px-2 py-1"
                              disabled={isSpecialPosition(pos)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'football' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Football Data Management</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-blue-800">Real Madrid Data</h3>
                  <p className="text-sm text-blue-700 mb-4">
                    The football data is automatically scraped from reliable sources like Transfermarkt, ESPN, and BBC Sport.
                    You can manually trigger a refresh of the data below.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => scrapeFootballData('preview')}
                      disabled={isLoading}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Loading...' : 'Preview Football Data'}
                    </button>
                    <button
                      onClick={() => scrapeFootballData('save')}
                      disabled={isLoading}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Updating...' : 'Update Football Data'}
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Data Sources</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Transfermarkt - Squad information</li>
                      <li>• BBC Sport - Match results and fixtures</li>
                      <li>• ESPN - Player statistics</li>
                      <li>• Wikipedia - Team information</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Current Status</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Squad: Auto-scraped from Transfermarkt</li>
                      <li>• Results: Auto-scraped from BBC Sport</li>
                      <li>• Fixtures: Auto-scraped from BBC Sport</li>
                      <li>• Team Info: Auto-scraped from Wikipedia</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
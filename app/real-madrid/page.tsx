'use client';

import { useState, useEffect } from 'react';

interface Player {
  id: number;
  name: string;
  position: string;
  nationality: string;
  age: number;
  shirtNumber?: number;
  goals: number;
  assists: number;
}

interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  competition: string;
  status: string;
}

interface Standing {
  position: number;
  team: string;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

interface TeamInfo {
  name: string;
  founded: number;
  stadium: string;
  capacity: number;
  manager: string;
  league: string;
  currentPosition: number;
}

export default function RealMadridPage() {
  const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null);
  const [squad, setSquad] = useState<Player[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [recentResults, setRecentResults] = useState<Match[]>([]);
  const [upcomingGames, setUpcomingGames] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states for squad table
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [nationalityFilter, setNationalityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchRealMadridData();
  }, []);

  const fetchRealMadridData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch team info
      const teamResponse = await fetch('/api/football/team-info');
      const teamData = await teamResponse.json();
      
      if (teamData.success) {
        setTeamInfo(teamData.data);
      }

      // Fetch squad
      const squadResponse = await fetch('/api/football/squad');
      const squadData = await squadResponse.json();
      
      if (squadData.success) {
        setSquad(squadData.data);
      }

      // Fetch standings
      const standingsResponse = await fetch('/api/football/standings');
      const standingsData = await standingsResponse.json();
      
      if (standingsData.success) {
        setStandings(standingsData.data);
      }

      // Fetch recent results
      const resultsResponse = await fetch('/api/football/recent-results');
      const resultsData = await resultsResponse.json();
      
      if (resultsData.success) {
        setRecentResults(resultsData.data);
      }

      // Fetch upcoming games
      const upcomingResponse = await fetch('/api/football/upcoming-games');
      const upcomingData = await upcomingResponse.json();
      
      if (upcomingData.success) {
        setUpcomingGames(upcomingData.data);
      }

    } catch (err) {
      setError('Failed to load Real Madrid data. Please try again later.');
      console.error('Error fetching Real Madrid data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter squad based on search and filters
  const filteredSquad = squad.filter(player => {
    const matchesPosition = positionFilter === 'all' || player.position === positionFilter;
    const matchesNationality = nationalityFilter === 'all' || player.nationality === nationalityFilter;
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.nationality.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesPosition && matchesNationality && matchesSearch;
  });

  // Get unique positions and nationalities for filters
  const positions = [...new Set(squad.map(player => player.position))].sort();
  const nationalities = [...new Set(squad.map(player => player.nationality))].sort();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMatchResult = (match: Match) => {
    if (match.status === 'SCHEDULED') return 'vs';
    if (match.homeTeam === 'Real Madrid') {
      return `${match.homeScore} - ${match.awayScore}`;
    } else {
      return `${match.awayScore} - ${match.homeScore}`;
    }
  };

  const getOpponent = (match: Match) => {
    return match.homeTeam === 'Real Madrid' ? match.awayTeam : match.homeTeam;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Real Madrid data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchRealMadridData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Real Madrid</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</span>
              <button
                onClick={fetchRealMadridData}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Team Summary */}
        {teamInfo && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Club Info</h3>
                <p className="text-gray-600">Founded: {teamInfo.founded}</p>
                <p className="text-gray-600">Stadium: {teamInfo.stadium}</p>
                <p className="text-gray-600">Capacity: {teamInfo.capacity.toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Season</h3>
                <p className="text-gray-600">League: {teamInfo.league}</p>
                <p className="text-gray-600">Position: {teamInfo.currentPosition}</p>
                <p className="text-gray-600">Manager: {teamInfo.manager}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Squad</h3>
                <p className="text-gray-600">Total Players: {squad.length}</p>
                <p className="text-gray-600">Average Age: {(squad.reduce((sum, player) => sum + player.age, 0) / squad.length).toFixed(1)}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Recent Form</h3>
                <p className="text-gray-600">Last 5: {recentResults.slice(0, 5).map(match => 
                  match.homeTeam === 'Real Madrid' ? 
                    (match.homeScore! > match.awayScore! ? 'W' : match.homeScore! === match.awayScore! ? 'D' : 'L') :
                    (match.awayScore! > match.homeScore! ? 'W' : match.awayScore! === match.homeScore! ? 'D' : 'L')
                ).join(' ')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Squad Roster */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Squad Roster</h2>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="all">All Positions</option>
                {positions.map(position => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
              <select
                value={nationalityFilter}
                onChange={(e) => setNationalityFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="all">All Nationalities</option>
                {nationalities.map(nationality => (
                  <option key={nationality} value={nationality}>{nationality}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setPositionFilter('all');
                  setNationalityFilter('all');
                }}
                className="w-full bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Squad Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nationality</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goals</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assists</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSquad.map((player) => (
                  <tr key={player.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {player.shirtNumber || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {player.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {player.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {player.nationality}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {player.age}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {player.goals}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {player.assists}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredSquad.length} of {squad.length} players
          </div>
        </div>

        {/* Standings and Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Standings */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">La Liga Standings</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Pos</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">P</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">W</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">D</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">L</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Pts</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {standings.slice(0, 10).map((team) => (
                    <tr key={team.position} className={team.team === 'Real Madrid' ? 'bg-blue-50' : ''}>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        {team.position}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {team.team}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        {team.playedGames}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        {team.won}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        {team.draw}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        {team.lost}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        {team.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Results */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Results</h2>
            <div className="space-y-4">
              {recentResults.slice(0, 5).map((match) => (
                <div key={match.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{getOpponent(match)}</span>
                      <span className="text-xs text-gray-500">{match.competition}</span>
                    </div>
                    <div className="text-xs text-gray-500">{formatDate(match.date)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{getMatchResult(match)}</div>
                    <div className="text-xs text-gray-500">{match.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Games */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingGames.slice(0, 6).map((match) => (
              <div key={match.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="text-sm font-medium text-gray-900 mb-2">{match.competition}</div>
                <div className="text-lg font-semibold mb-2">
                  Real Madrid vs {getOpponent(match)}
                </div>
                <div className="text-sm text-gray-500">{formatDate(match.date)}</div>
                <div className="text-xs text-gray-400 mt-1">{match.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
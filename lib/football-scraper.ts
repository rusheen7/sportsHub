import * as cheerio from 'cheerio';

interface ScrapedPlayer {
  id: number;
  name: string;
  position: string;
  nationality: string;
  age: number;
  shirtNumber?: number;
  goals: number;
  assists: number;
}

interface ScrapedMatch {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  competition: string;
  status: string;
}

interface ScrapedTeamInfo {
  name: string;
  founded: number;
  stadium: string;
  capacity: number;
  manager: string;
  league: string;
  currentPosition: number;
}

export async function scrapeRealMadridSquad(): Promise<ScrapedPlayer[]> {
  try {
    // Try Transfermarkt first
    const response = await fetch('https://www.transfermarkt.com/real-madrid/kader/verein/418', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (response.ok) {
      const html = await response.text();
      const $ = cheerio.load(html);
      const players: ScrapedPlayer[] = [];
      
      $('.items tbody tr').each((index, element) => {
        const name = $(element).find('.hauptlink a').text().trim();
        const position = $(element).find('td:nth-child(2)').text().trim();
        const nationality = $(element).find('.flaggenrahmen').attr('title') || '';
        const ageText = $(element).find('td:nth-child(4)').text().trim();
        const age = parseInt(ageText) || 0;
        const shirtNumberText = $(element).find('td:nth-child(1)').text().trim();
        const shirtNumber = parseInt(shirtNumberText) || undefined;
        
        if (name && position) {
          players.push({
            id: index + 1,
            name,
            position,
            nationality,
            age,
            shirtNumber,
            goals: 0, // Would need to scrape from stats page
            assists: 0
          });
        }
      });
      
      if (players.length > 0) {
        return players;
      }
    }
  } catch (error) {
    console.log('Transfermarkt scraping failed:', error);
  }

  // Fallback to ESPN
  try {
    const response = await fetch('https://www.espn.com/soccer/team/squad/_/name/real-madrid', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (response.ok) {
      const html = await response.text();
      const $ = cheerio.load(html);
      const players: ScrapedPlayer[] = [];
      
      $('.Table__TR').each((index, element) => {
        const name = $(element).find('.Table__TD:nth-child(1)').text().trim();
        const position = $(element).find('.Table__TD:nth-child(2)').text().trim();
        const nationality = $(element).find('.Table__TD:nth-child(3)').text().trim();
        const ageText = $(element).find('.Table__TD:nth-child(4)').text().trim();
        const age = parseInt(ageText) || 0;
        
        if (name && position) {
          players.push({
            id: index + 1,
            name,
            position,
            nationality,
            age,
            goals: 0,
            assists: 0
          });
        }
      });
      
      if (players.length > 0) {
        return players;
      }
    }
  } catch (error) {
    console.log('ESPN scraping failed:', error);
  }

  // Return empty array if all scraping fails
  return [];
}

export async function scrapeRealMadridResults(): Promise<ScrapedMatch[]> {
  try {
    // Try BBC Sport
    const response = await fetch('https://www.bbc.com/sport/football/teams/real-madrid/results', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (response.ok) {
      const html = await response.text();
      const $ = cheerio.load(html);
      const matches: ScrapedMatch[] = [];
      
      $('.gs-c-promo').each((index, element) => {
        const title = $(element).find('.gs-c-promo-heading__title').text().trim();
        const dateText = $(element).find('time').attr('datetime') || '';
        
        if (title && dateText) {
          // Parse match info from title (e.g., "Real Madrid 2-1 Barcelona")
          const matchInfo = parseMatchFromTitle(title);
          if (matchInfo) {
            matches.push({
              id: index + 1,
              ...matchInfo,
              date: dateText,
              competition: 'La Liga', // Default, would need more parsing
              status: 'FINISHED'
            });
          }
        }
      });
      
      if (matches.length > 0) {
        return matches.slice(0, 10); // Return last 10 matches
      }
    }
  } catch (error) {
    console.log('BBC Sport scraping failed:', error);
  }

  return [];
}

export async function scrapeRealMadridFixtures(): Promise<ScrapedMatch[]> {
  try {
    // Try BBC Sport fixtures
    const response = await fetch('https://www.bbc.com/sport/football/teams/real-madrid/fixtures', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (response.ok) {
      const html = await response.text();
      const $ = cheerio.load(html);
      const matches: ScrapedMatch[] = [];
      
      $('.gs-c-promo').each((index, element) => {
        const title = $(element).find('.gs-c-promo-heading__title').text().trim();
        const dateText = $(element).find('time').attr('datetime') || '';
        
        if (title && dateText) {
          const matchInfo = parseMatchFromTitle(title);
          if (matchInfo) {
            matches.push({
              id: index + 1,
              ...matchInfo,
              date: dateText,
              competition: 'La Liga',
              status: 'SCHEDULED'
            });
          }
        }
      });
      
      if (matches.length > 0) {
        return matches.slice(0, 10);
      }
    }
  } catch (error) {
    console.log('BBC Sport fixtures scraping failed:', error);
  }

  return [];
}

export async function scrapeRealMadridTeamInfo(): Promise<ScrapedTeamInfo | null> {
  try {
    // Try Wikipedia for basic team info
    const response = await fetch('https://en.wikipedia.org/wiki/Real_Madrid_CF', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (response.ok) {
      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Extract basic info from Wikipedia
      const foundedText = $('th:contains("Founded")').next('td').text().trim();
      const founded = parseInt(foundedText) || 1902;
      
      const stadiumText = $('th:contains("Ground")').next('td').text().trim();
      const stadium = stadiumText || 'Santiago Bernabéu';
      
      // Try to find current manager
      const managerText = $('th:contains("Manager")').next('td').text().trim();
      const manager = managerText || 'Carlo Ancelotti'; // Default fallback
      
      return {
        name: 'Real Madrid CF',
        founded,
        stadium,
        capacity: 81044,
        manager,
        league: 'La Liga',
        currentPosition: 1 // Would need to scrape from standings
      };
    }
  } catch (error) {
    console.log('Wikipedia scraping failed:', error);
  }

  return null;
}

function parseMatchFromTitle(title: string): { homeTeam: string; awayTeam: string; homeScore?: number; awayScore?: number } | null {
  // Parse titles like "Real Madrid 2-1 Barcelona" or "Barcelona v Real Madrid"
  const realMadridPattern = /(?:Real Madrid|Madrid)\s*(\d+)?\s*[-v]\s*(\d+)?\s*(.+)/i;
  const match = title.match(realMadridPattern);
  
  if (match) {
    const homeScore = match[1] ? parseInt(match[1]) : undefined;
    const awayScore = match[2] ? parseInt(match[2]) : undefined;
    const opponent = match[3].trim();
    
    if (title.toLowerCase().includes('real madrid') && title.toLowerCase().indexOf('real madrid') < title.toLowerCase().indexOf(opponent.toLowerCase())) {
      return {
        homeTeam: 'Real Madrid',
        awayTeam: opponent,
        homeScore,
        awayScore
      };
    } else {
      return {
        homeTeam: opponent,
        awayTeam: 'Real Madrid',
        homeScore: awayScore,
        awayScore: homeScore
      };
    }
  }
  
  return null;
} 
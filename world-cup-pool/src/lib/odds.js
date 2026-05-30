const SPORT_KEY = 'soccer_fifa_world_cup'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

let oddsCache = null
let cacheFetchedAt = 0
let pendingFetch = null

// Some teams have different names in The Odds API vs our data
const ALIASES = {
  'USA': ['United States', 'USA'],
  'South Korea': ['South Korea', 'Korea Republic'],
  'Ivory Coast': ['Ivory Coast', "Cote d'Ivoire", "Côte d'Ivoire", 'Cote dIvoire'],
  'DR Congo': ['DR Congo', 'Congo DR', 'Democratic Republic of Congo', 'Congo, DR'],
  'New Zealand': ['New Zealand'],
  'Saudi Arabia': ['Saudi Arabia'],
}

function normalize(s) {
  return s.toLowerCase().replace(/[^a-z]/g, '')
}

function namesMatch(ourName, apiName) {
  const n1 = normalize(ourName)
  const n2 = normalize(apiName)
  if (n1 === n2) return true
  if (n1.includes(n2) || n2.includes(n1)) return true
  const aliases = ALIASES[ourName]
  if (aliases) return aliases.some(a => normalize(a) === n2)
  return false
}

export async function fetchAllOdds() {
  const apiKey = import.meta.env.VITE_ODDS_API_KEY
  if (!apiKey) return null

  const now = Date.now()
  if (oddsCache && now - cacheFetchedAt < CACHE_TTL) return oddsCache

  // Deduplicate concurrent calls
  if (pendingFetch) return pendingFetch

  pendingFetch = (async () => {
    try {
      const res = await fetch(
        `https://api.the-odds-api.com/v4/sports/${SPORT_KEY}/odds/?apiKey=${apiKey}&regions=us,eu&markets=h2h&oddsFormat=decimal`
      )
      if (!res.ok) return oddsCache ?? null
      const events = await res.json()
      oddsCache = events
      cacheFetchedAt = Date.now()
      return events
    } catch {
      return oddsCache ?? null
    } finally {
      pendingFetch = null
    }
  })()

  return pendingFetch
}

// Extract normalised h2h probabilities for a given match.
// Returns { home, draw, away } as percentages, or null if no data found.
export function getMatchOdds(homeTeam, awayTeam, events) {
  if (!Array.isArray(events)) return null

  const event = events.find(e => {
    const homeMatch =
      namesMatch(homeTeam, e.home_team) || namesMatch(homeTeam, e.away_team)
    const awayMatch =
      namesMatch(awayTeam, e.away_team) || namesMatch(awayTeam, e.home_team)
    return homeMatch && awayMatch
  })

  if (!event || !event.bookmakers?.length) return null

  const isFlipped = namesMatch(homeTeam, event.away_team)

  const homePrices = []
  const drawPrices = []
  const awayPrices = []

  event.bookmakers.forEach(bm => {
    const h2h = bm.markets?.find(m => m.key === 'h2h')
    if (!h2h) return
    h2h.outcomes.forEach(o => {
      if (o.name === 'Draw') {
        drawPrices.push(o.price)
      } else if (namesMatch(isFlipped ? awayTeam : homeTeam, o.name)) {
        homePrices.push(o.price)
      } else {
        awayPrices.push(o.price)
      }
    })
  })

  if (!homePrices.length || !drawPrices.length || !awayPrices.length) return null

  const avg = arr => arr.reduce((s, x) => s + x, 0) / arr.length
  const rh = 1 / avg(homePrices)
  const rd = 1 / avg(drawPrices)
  const ra = 1 / avg(awayPrices)
  const total = rh + rd + ra

  return {
    home: Math.round((rh / total) * 100),
    draw: Math.round((rd / total) * 100),
    away: Math.round((ra / total) * 100),
    bookmakers: event.bookmakers.length,
  }
}

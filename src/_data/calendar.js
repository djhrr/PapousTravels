const https  = require('https');
const ical   = require('node-ical');

const ICAL_URL = process.env.GCAL_ICAL_URL;

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const opts = Object.assign(require('url').parse(url), { rejectUnauthorized: false });
    https.get(opts, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

module.exports = async function() {
  if (!ICAL_URL) return [];

  const icsText = await fetchUrl(ICAL_URL);
  const data    = ical.parseICS(icsText);

  const now     = new Date();
  const weekOut = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const events = Object.values(data)
    .filter(e => e.type === 'VEVENT' && e.start && e.start >= now && e.start <= weekOut)
    .sort((a, b) => a.start - b.start)
    .map(e => ({
      summary: e.summary || '(No title)',
      start:   e.start,
      allDay:  e.datetype === 'date',
      location: e.location || ''
    }));

  return events;
};

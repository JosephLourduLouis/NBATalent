const express = require('express');
const cors = require('cors');
require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// manually getting the nba players
app.get('/api/players', async (req, res) => {
  const country = req.query.country || 'USA';

  try {
    const response = await fetch(`https://api-nba-v1.p.rapidapi.com/players?country=${country}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
      }
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Failed to fetch player data' });
  }
});

// saving the players stats manually
app.post('/api/save-stats', async (req, res) => {
  const { player_id, firstname, lastname, nationality, season, ppg, apg, rpg } = req.body;

  try {
    const { data, error } = await supabase
      .from('players_stats')
      .insert([{ player_id, firstname, lastname, nationality, season, ppg, apg, rpg }])
      .select();

    if (error) throw error;

    res.status(201).json({ message: 'Player stats saved successfully', data });
  } catch (err) {
    console.error('Error saving to Supabase:', err);
    res.status(500).json({ error: 'Failed to save player stats' });
  }
});

// retrieving the stats
app.get('/api/stats', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('players_stats')
      .select('*');

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error('Error fetching from Supabase:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// using page loop to try and get all the players
app.post('/api/load-all-players', async (req, res) => {
  const season = 2023;
  let page = 1;
  let totalInserted = 0;
  let skipped = 0;
  let allDone = false;

  try {
    while (!allDone) {
      const response = await fetch(`https://api-nba-v1.p.rapidapi.com/players?league=standard&season=${season}&page=${page}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
        }
      });

      const json = await response.json();
      const players = json.response;

      if (!players || players.length === 0) {
        allDone = true;
        break;
      }

      for (const player of players) {
        const player_id = player.id;

        // for duplicate players
        const { data: existing, error: existsError } = await supabase
          .from('players_stats')
          .select('player_id')
          .eq('player_id', player_id);

        if (existing && existing.length > 0) {
          skipped++;
          continue;
        }

        const stats = {
          player_id: player_id,
          firstname: player.firstname,
          lastname: player.lastname,
          nationality: player.birth?.country || 'Unknown',
          season: season,
          ppg: Math.random() * 30,
          apg: Math.random() * 10,
          rpg: Math.random() * 12
        };

        const { error } = await supabase.from('players_stats').insert([stats]);
        if (!error) totalInserted++;
      }

      console.log(`Finished page ${page} — Inserted: ${totalInserted}, Skipped: ${skipped}`);
      page++;
    }

    res.json({ message: 'All players loaded', totalInserted, skipped });
  } catch (err) {
    console.error('Load failed:', err);
    res.status(500).json({ error: 'Failed to load all players' });
  }
});

// starting server
app.listen(PORT, () => {
  console.log(`Server is running at http://0.0.0.0:${PORT}`);
});

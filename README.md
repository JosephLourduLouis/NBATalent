# NBA Talent Comparison: USA vs International Players

For Developer manual, go to the [Developer Manual](#developer-manual)

## Project Description

This web application compares NBA players' statistics between US and International players. Using real-time data from the API-NBA given by API-Sports, this app will visualize the most popular stats such as Points Per Game (PPG), Assists Per Game (APG), and Rebounds Per Game (RPG) across multiple seasons to highlight trends and insights. The application is designed for NBA scouts, front office executives, media analysts, and fans interested in evaluating the evolving dynamics of talent in the league.

## Target Browsers

This application is designed to work on all major modern browsers on both desktop and mobile platforms, including:
- Google Chrome
- iOS Safari
- Android Chrome

## Developer Manual

This is the Vercel link...https://nbatalent-dn0zi831j-josephlourdulouis-projects.vercel.app/index.html

If Vercel is not working...Please install node.js. You can download it here: https://nodejs.org/en/download

### Setup and Installation

1. **Clone the Repository**
   ```bash
   git clone git@github.com:JosephLourduLouis/NBATalent.git  
   cd NBATalent
2. **Install the dependencies**
   ```bash
   mkdir server
   cd server
    \. "$HOME/.nvm/nvm.sh"  
   nvm install 22
   nvm -v
   npm -v
   npm init -y
   npm install express cors dotenv node-fetch supabase 
3. **Create a .env file**
Create a .env file
Add the following
SUPABASE_URL=url
SUPABASE_KEY=supabase key
RAPIDAPI_KEY=rapidapi key
4. **Start the server**
node index.js
5. **Open frontend**
Open index.html in browser.

### Known Bugs
The load-all-players route assigns random PPG/APG/RPG since actual stat endpoints require paid subscription.

The Vercel deployment may not support Express server hosting, so backend may need to be deployed separately.
    The table, bar charts, and pie charts would disappear if this happens.

### Roadmap for Future Development
Replace random statatistics with real player statistics by getting full subscription

Add multiple seasons to visualizations/charts

Host both frontend and backend together using full-stack hosting (like Netlify)
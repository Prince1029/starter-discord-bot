const { Client, GatewayIntentBits, Collection } = require('discord.js');
const axios = require('axios');
const express = require('express');
const { InteractionType, InteractionResponseType, verifyKeyMiddleware } = require('discord-interactions');
const helmet = require('helmet');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const prefix = '!';

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Collection to store custom commands
const customCommands = new Collection();

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Check for custom commands
  const customCommand = customCommands.get(message.content.toLowerCase());
  if (customCommand) {
    message.channel.send(customCommand);
    return;
  }

  if (!message.content.startsWith(prefix)) return;

  const [command, ...args] = message.content.slice(prefix.length).split(' ');

  // Help and Commands commands
  if (command === 'help') {
    // ... (existing help command)
  }

  // Custom command for moderators
  if (command === 'customcommand' && message.member.permissions.has('KICK_MEMBERS')) {
    // ... (existing custom command)
  }

  // Announcements
  if (command === 'announce' && message.member.permissions.has('ADMINISTRATOR')) {
    // ... (existing announce command)
  }

  // Role management
  if (command === 'giverole' && message.member.permissions.has('MANAGE_ROLES')) {
    // ... (existing giverole command)
  }

  // In-chat dashboard
  if (command === 'dashboard' && message.member.permissions.has('ADMINISTRATOR')) {
    // ... (existing dashboard command)
  }

  // Random Meme Command
  if (command === 'randommeme') {
    // ... (existing randommeme command)
  }

  // Emoji Menu
  if (command === 'emojimenu') {
    // ... (existing emojimenu command)
  }

  // Meme Maker/Generator
  if (command === 'makememe') {
    // ... (existing makememe command)
  }

  // Music Recommendations
  if (command === 'musicrec') {
    const genre = args.join(' ');

    if (genre) {
      try {
        // Get Spotify access token
        const authResponse = await axios.post(
          'https://accounts.spotify.com/api/token',
          new URLSearchParams({
            grant_type: 'client_credentials',
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `Basic ${Buffer.from(
                `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
              ).toString('base64')}`,
            },
          }
        );

        const accessToken = authResponse.data.access_token;

        // Search for a track based on the specified genre
        const searchResponse = await axios.get(
          `https://api.spotify.com/v1/search?q=${genre}&type=track&limit=1`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const track = searchResponse.data.tracks.items[0];
        const trackUrl = track.external_urls.spotify;

        message.channel.send(`Check out this awesome ${genre} song recommendation: ${trackUrl}`);
      } catch (error) {
        console.error('Error fetching music recommendation:', error);
        message.channel.send('An error occurred while fetching the music recommendation.');
      }
    } else {
      message.channel.send('Please specify a genre for the music recommendation.');
    }
  }

  // Add more commands as needed...
});

// Express web server
const app = express();

app.use(express.json());
app.use(helmet());

app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async (req, res) => {
  const interaction = req.body;

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    console.log(interaction.data.name);

    if (interaction.data.name === 'yo') {
      // ... (existing yo slash command)
    }

    if (interaction.data.name === 'dm') {
      // ... (existing dm slash command)
    }
  }
});

app.get('/register_commands', async (req, res) => {
  // ... (existing register_commands logic)
});

const PORT = process.env.PORT || 8999;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// Login to Discord with your bot token
client.login(process.env.DISCORD_TOKEN);

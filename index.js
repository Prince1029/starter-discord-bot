const { Client, GatewayIntentBits } = require('discord.js');
const ytdl = require('ytdl-core');
const axios = require('axios');
const express = require('express');
const { InteractionType, InteractionResponseType, verifyKeyMiddleware } = require('discord-interactions');
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

client.on('messageCreate', async (message) => {
  // ... (your existing message handling code)
});

// ... (your other event handlers)

const app = express();

app.use(express.json());

app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async (req, res) => {
  const interaction = req.body;

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    console.log(interaction.data.name);

    if (interaction.data.name == 'yo') {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Yo ${interaction.member.user.username}!`,
        },
      });
    }

    if (interaction.data.name == 'dm') {
      let c = (await axios.post(`https://discord.com/api/users/@me/channels`, {
        recipient_id: interaction.member.user.id,
      })).data;

      try {
        let res = await axios.post(`https://discord.com/api/channels/${c.id}/messages`, {
          content: 'Yo! I got your slash command. I am not able to respond to DMs, just slash commands.',
        });
        console.log(res.data);
      } catch (e) {
        console.log(e);
      }

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: '👍',
        },
      });
    }
  }
});

app.get('/register_commands', async (req, res) => {
  let slashCommands = [
    {
      name: 'yo',
      description: 'replies with Yo!',
      options: [],
    },
    {
      name: 'dm',
      description: 'sends user a DM',
      options: [],
    },
  ];

  try {
    let discordResponse = await axios.put(
      `https://discord.com/api/applications/${process.env.APPLICATION_ID}/guilds/${process.env.GUILD_ID}/commands`,
      slashCommands
    );
    console.log(discordResponse.data);
    return res.send('Commands have been registered');
  } catch (e) {
    console.error(e.code);
    console.error(e.response?.data);
    return res.send(`${e.code} error from Discord`);
  }
});

app.get('/', async (req, res) => {
  return res.send('Follow documentation ');
});

app.listen(8999, () => {
  console.log('Express app listening on port 8999');
});

client.login(process.env.DISCORD_TOKEN);

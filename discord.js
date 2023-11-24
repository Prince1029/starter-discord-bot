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
    const helpEmbed = {
      color: 0x0099ff,
      title: 'Bot Commands',
      fields: [
        { name: '!help', value: 'Displays a list of available commands.' },
        { name: '!commands', value: 'Lists all available commands.' },
        // Add information about other commands...
      ],
    };

    message.channel.send({ embeds: [helpEmbed] });
  }

  // Custom command for moderators
  if (command === 'customcommand' && message.member.permissions.has('KICK_MEMBERS')) {
    // Your custom command logic here
    message.channel.send('This is a custom command for moderators!');
  }

  // Announcements
  if (command === 'announce' && message.member.permissions.has('ADMINISTRATOR')) {
    const announcementChannel = message.guild.channels.cache.find((channel) => channel.name === 'announcements');
    announcementChannel.send(args.join(' '));
  }

  // Role management
  if (command === 'giverole' && message.member.permissions.has('MANAGE_ROLES')) {
    const roleName = args.join(' ');
    const role = message.guild.roles.cache.find((r) => r.name === roleName);
    if (role) {
      message.member.roles.add(role);
      message.channel.send(`You now have the ${roleName} role!`);
    } else {
      message.channel.send(`Role "${roleName}" not found.`);
    }
  }

  // In-chat dashboard (using a placeholder for simplicity)
  if (command === 'dashboard' && message.member.permissions.has('ADMINISTRATOR')) {
    // Implement in-chat dashboard logic
    message.channel.send('Dashboard functionality coming soon!');
  }

  // Random Meme Command
  if (command === 'randommeme') {
    // Implement randommeme command logic
    message.channel.send('Here is a random meme!');
  }

  // Emoji Menu
  if (command === 'emojimenu') {
    // Implement emojimenu command logic
    message.channel.send('This is an emoji menu!');
  }

  // Meme Maker/Generator
  if (command === 'makememe') {
    // Implement makememe command logic
    message.channel.send('Meme created with custom text!');
  }

  // Invite Tracker
  if (command === 'invitetracker' && message.member.permissions.has('ADMINISTRATOR')) {
    const invites = await message.guild.invites.fetch();
    const inviteInfo = invites.map((invite) => `Invite Code: ${invite.code}, Uses: ${invite.uses}`).join('\n');
    message.channel.send(`**Invite Tracker:**\n${inviteInfo}`);
  }

  // Welcoming new users
  if (command === 'welcome' && message.member.permissions.has('MANAGE_CHANNELS')) {
    const welcomeChannel = message.guild.channels.cache.find((channel) => channel.name === 'welcome');
    welcomeChannel.send(`Welcome to the server, ${message.author.username}!`);
  }

  // Add more commands as needed...

});

// ... (remaining code)

// Slash command handling
const app = express();

app.use(express.json());
app.use(helmet());

app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async (req, res) => {
  const interaction = req.body;

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    console.log(interaction.data.name);

    if (interaction.data.name === 'yo') {
      // Implement yo slash command logic
      res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Yo ${interaction.member.user.username}!`,
        },
      });
    }

    if (interaction.data.name === 'dm') {
      // Implement dm slash command logic
      res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: '👍',
        },
      });
    }
  }
});

// Register slash commands
app.get('/register_commands', async (req, res) => {
  // Implement register_commands logic
  res.send('Commands have been registered');
});

// Start the Express web server
const PORT = process.env.PORT || 8999;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// Login to Discord with your bot token
client.login(process.env.DISCORD_TOKEN);

const { Client, GatewayIntentBits } = require('discord.js');
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
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const [command, ...args] = message.content.slice(prefix.length).split(' ');

  // Help command
  if (command === 'help') {
    const helpEmbed = {
      color: 0x0099ff,
      title: 'Bot Commands',
      fields: [
        { name: '!help', value: 'Displays a list of available commands.' },
        { name: '!commands', value: 'Lists all available commands.' },
        { name: '!purge [count]', value: 'Deletes a specified number of messages (default: 100).' },
        // Add information about other commands...
      ],
    };

    message.channel.send({ embeds: [helpEmbed] });
  }

  // Commands command
  if (command === 'commands') {
    const commandsList = [
      '!help - Displays a list of available commands.',
      '!commands - Lists all available commands.',
      '!purge [count] - Deletes a specified number of messages (default: 100).',
      // Add information about other commands...
    ];

    message.channel.send(`**Available Commands:**\n${commandsList.join('\n')}`);
  }

  // Moderation commands
  if (command === 'purge' && message.member.permissions.has('MANAGE_MESSAGES')) {
    const deleteCount = parseInt(args[0], 10) || 100;
    message.channel.bulkDelete(deleteCount);
  }
  // Add other moderation commands (kick, ban, mute) as needed...

  // Music commands (using a placeholder for simplicity)
  if (command === 'play') {
    // Implement music play command
    message.channel.send('Playing music coming soon!');
  }
  // Add other music-related commands as needed...

  // Invite Tracker
  if (command === 'invitetracker') {
    // Implement invite tracker logic
    message.channel.send('Invite tracker functionality coming soon!');
  }

  // Welcoming new users
  if (command === 'welcome') {
    if (message.member.permissions.has('MANAGE_CHANNELS')) {
      const welcomeChannel = message.guild.channels.cache.find((channel) => channel.name === 'welcome');
      welcomeChannel.send(`Welcome to the server, ${message.author.username}!`);
    }
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

  // Add more commands as needed...

});

// ... (remaining code)

// Slash command handling
const app = express();

app.use(express.json());

app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async (req, res) => {
  const interaction = req.body;

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    console.log(interaction.data.name);

    if (interaction.data.name === 'yo') {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Yo ${interaction.member.user.username}!`,
        },
      });
    }

    if (interaction.data.name === 'dm') {
      let c = (await axios.post(`https://discord.com/api/users/@me/channels`, {
        recipient_id: interaction.member.user.id,
      })).data;

      try {
        let res = await axios.post(`https://discord.com/api/channels/${c.id}/messages`, {
          content: 'Yo! I got your slash command. I am not able to respond to DMs just slash commands.',
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

// Login to Discord with your bot token
client.login(process.env.DISCORD_TOKEN);


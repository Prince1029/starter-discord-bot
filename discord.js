const { Client, GatewayIntentBits } = require('discord.js');
const ytdl = require('ytdl-core');
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
  } else if (command === 'kick' && message.member.permissions.has('KICK_MEMBERS')) {
    const member = message.mentions.members.first();
    if (member) {
      member.kick();
      message.channel.send(`${member.user.tag} has been kicked.`);
    }
  } else if (command === 'ban' && message.member.permissions.has('BAN_MEMBERS')) {
    const member = message.mentions.members.first();
    if (member) {
      member.ban();
      message.channel.send(`${member.user.tag} has been banned.`);
    }
  } else if (command === 'mute' && message.member.permissions.has('MUTE_MEMBERS')) {
    // Implement mute logic here
    message.channel.send('Muting functionality coming soon!');
  }

  // Music commands (using a placeholder for simplicity)
  if (command === 'play') {
    // Implement music play command
    message.channel.send('Playing music coming soon!');
  }

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

  // Music recommendation command
  if (command === 'musicrec') {
    const genre = args.join(' ').toLowerCase();
    const genreMap = {
      'pop': ['pop music', 'pop songs'],
      'rock': ['rock music', 'classic rock', 'alternative rock'],
      'hiphop': ['hip hop music', 'rap music'],
      'classical': ['classical music', 'symphony'],
      'edm': ['electronic dance music', 'house music'],
      'jazz': ['jazz music', 'smooth jazz'],
      'country': ['country music', 'bluegrass'],
      'metal': ['metal music', 'heavy metal'],
      'rnb': ['rhythm and blues music', 'soul music'],
      'indie': ['indie music', 'indie rock'],
      'reggae': ['reggae music', 'dancehall'],
      'blues': ['blues music', 'electric blues'],
      'punk': ['punk music', 'pop punk'],
      'folk': ['folk music', 'folk rock'],
      'latin': ['latin music', 'salsa'],
      // Add more genres and their corresponding search queries including sub-genres
    };

    if (genre in genreMap) {
      const subGenres = genreMap[genre];
      const randomSubGenre = getRandomElement(subGenres);
      const searchQuery = randomSubGenre || genreMap[genre][0]; // Use the first genre if no sub-genres
      const videoUrl = await getYouTubeUrl(searchQuery);

      if (videoUrl) {
        message.reply(`Here's a ${genre} recommendation (${randomSubGenre || 'main genre'}): ${videoUrl}`);
      } else {
        message.reply(`Sorry, I couldn't find a recommendation for ${genre}.`);
      }
    } else {
      const supportedGenres = Object.keys(genreMap).join(', ');
      message.reply(`Invalid genre. Supported genres: ${supportedGenres}`);
    }
  }

  // ... (other commands)

});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const [command, ...args] = message.content.slice(prefix.length).split(' ');

  // Verification system
  if (command === 'verify') {
    // Implement verification logic here
    // For example, you might assign a "Verified" role to the user
    const verifiedRole = message.guild.roles.cache.find((role) => role.name === 'Verified');
    if (verifiedRole) {
      message.member.roles.add(verifiedRole);
      message.reply('You have been verified!');
    } else {
      message.reply('Verification role not found. Contact the server administrator.');
    }
  }

  // Chat logs channel creation command
  if (command === 'createchatlogschannel' && message.member.permissions.has('MANAGE_CHANNELS')) {
    const guild = message.guild;
    const channelName = 'chat-logs';

    // Check if the channel already exists
    const existingChannel = guild.channels.cache.find((channel) => channel.name === channelName);
    if (existingChannel) {
      message.reply('Chat logs channel already exists.');
    } else {
      // Create the channel
      try {
        const createdChannel = await guild.channels.create(channelName, {
          type: 'text',
          topic: 'Chat logs will be recorded here.',
        });
        message.reply(`Chat logs channel created: ${createdChannel}`);
      } catch (error) {
        console.error('Error creating chat logs channel:', error);
        message.reply('An error occurred while creating the chat logs channel.');
      }
    }
  }

  // ... (other commands)

});

// ... (remaining code)

client.login(process.env.DISCORD_TOKEN);

async function getYouTubeUrl(searchQuery) {
  try {
    const searchResults = await ytdl.getBasicInfo(`ytsearch:${searchQuery}`);
    if (searchResults && searchResults.videoDetails) {
      return `https://www.youtube.com/watch?v=${searchResults.videoDetails.videoId}`;
    }
    return null;
  } catch (error) {
    console.error('Error fetching YouTube URL:', error);
    return null;
  }
}

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}


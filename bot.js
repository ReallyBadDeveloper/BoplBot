// add .env data
const dotenv = require('dotenv').config();
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const { EmbedBuilder, SlashCommandStringOption, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, } = require('discord.js');
const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const { createAudioPlayer, noSubscriberBehavior, joinVoiceChannel, createAudioResource } = require('@discordjs/voice');
const { abilities } = require('./abilities');
const fs = require('fs');
const path = require('path');
var configFile;
var dev = false;
var embedColors = {
  boplYellow: 0xfefe66,
  green: 0x54ff47,
  orange: 0xd99f3b,
  red: 0xbf2626,
};

var randomArr = function(arr) {
  return arr.at(arr.length*Math.random())

}

var commandsList = [
  ['random-combo','Sends a random combination of Bopl Battle abilities!'],
  ['abilities','Displays every ability in Bopl Battle!'],
  ['help','Provides help while using Bopl Bot.'],
  ['ping','Checks to see if the bot is online.'],
  ['music','Plays Bopl Battle music in your current voice channel!'],
  ['disconnect','Disconnects Bopl Bot from your voice channel.'],
  ['reviews','Gets the Steam reviews for Bopl Battle!']
]

var musicArr = [
  '/media/1.mp3',
  '/media/2.mp3',
  '/media/3.mp3',
  '/media/4.mp3',
  '/media/5.mp3'
];

const botCommands = [];

for (const i in commandsList) {
  botCommands.push(new SlashCommandBuilder().setName(commandsList[i][0]).setDescription(commandsList[i][1]));
}

const rest = new REST({ version: '10' }).setToken(TOKEN);

try {
  console.log('Started refreshing application (/) commands.');

  rest.put(Routes.applicationCommands(CLIENT_ID), { body: botCommands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}
const { Client, GatewayIntentBits, channel, ActivityType } = require('discord.js');
const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(client.guilds.cache.size + ' servers', { type: ActivityType.Watching});
  if (!dev) {
    client.channels.fetch('1236702177515409469').then(channel=>channel.send({
      embeds: [
        new EmbedBuilder().setColor(embedColors.green).setTitle('Bot is online! :wireless:').setDescription("Currently being hosted on Really Bad Dev's computer!")
      ]
    }));
  }
});

client.on('messageCreate', (message) => {
  if (message.content.toLowerCase().includes('kill yourself') || message.content.toLowerCase().includes('kys') || message.content.toLowerCase().includes('kill myself') || message.content.toLowerCase().includes('kms')) {
    message.reply('https://media1.tenor.com/m/c5a_h8U1MzkAAAAC/nuh-uh-beocord.gif')
  }
});

var reviewNum = -1;
var isTimedOut = false;
var connection;
var connector;

client.on('interactionCreate', async (interaction,message) => {
    var isHidden = true;
    if (interaction.channel.name.includes('command')) {
        isHidden = false;
    }
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName == 'random-combo') {
        var ability1 = client.emojis.cache.get(randomArr(abilities));
        var ability2 = client.emojis.cache.get(randomArr(abilities));
        var ability3 = client.emojis.cache.get(randomArr(abilities));

    await interaction.reply({ embeds: [
      new EmbedBuilder().setColor(embedColors.boplYellow).setTitle('Random Abilities').setDescription(`${ability1}${ability2}${ability3}`)
    ], ephemeral: isHidden });
  }
  if (interaction.commandName == 'abilities') {
    var emojiString;
    for (var emoji in abilities) {
        if (!emojiString) {
            emojiString = `${client.emojis.cache.get(abilities[emoji])} `;
        } else {
            emojiString = emojiString + `${client.emojis.cache.get(abilities[emoji])} `;
        }
    }
    await interaction.reply({ embeds: [
      new EmbedBuilder().setColor(embedColors.boplYellow).setTitle('Abilities').setDescription(emojiString)
    ], ephemeral: isHidden });
  }
  if (interaction.commandName == 'help') {
    var cmdString;
    for (var i in commandsList) {
      if (!cmdString) {
        cmdString = '- `/' + commandsList[i][0] + '` - ' + commandsList[i][1] + '\n';
      } else {
        cmdString = cmdString + '- `/' + commandsList[i][0] + '` - ' + commandsList[i][1] + '\n';
      }
    }
    await interaction.reply(
        {
            embeds: [new EmbedBuilder().setColor(embedColors.boplYellow).setTitle('Commands').setDescription(cmdString)],
            ephemeral: isHidden,
        }
    );
  }
  if (interaction.commandName == 'ping') {
    await interaction.reply({
      embeds: [
        new EmbedBuilder().setColor(embedColors.green).setTitle('Pong! :ping_pong:')
      ],
      ephemeral: isHidden,
    });
  }
  if (interaction.commandName == 'music') {
    try {
    if (interaction.member.voice.channel) {
      connection = joinVoiceChannel({
        channelId: interaction.member.voice.channel.id,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: false
      });
      connector = interaction.user.id
      const player = createAudioPlayer();
      const resource = await createAudioResource(__dirname + randomArr(musicArr));
      player.play(resource);
      connection.subscribe(player);
      player.on('error', error => {
        console.error(error.message)
      });
      player.on('end', () => { 
        connection.disconnect();
      });
      await interaction.reply({ embeds: [
        new EmbedBuilder().setColor(embedColors.green).setTitle('Success!').setDescription('Joined voice channel and started playing music!')
      ], ephemeral: isHidden
    });
    } else {
      await interaction.reply({ embeds: [
        new EmbedBuilder().setColor(embedColors.red).setTitle('Whoops!').setDescription("You're not in a voice channel!")
      ], ephemeral: isHidden });
    }
    } catch (e) {
      console.error(e);
    }
  }
  if (interaction.commandName == 'disconnect') {
    try {
    if (interaction.user.id == connector || interaction.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
      connection.disconnect();
      await interaction.reply({
        embeds: [new EmbedBuilder().setColor(embedColors.green).setTitle('Success!').setDescription('Successfully left the voice channel!')],
        ephemeral: isHidden
      });
    } else {
      await interaction.reply({
        embeds: [new EmbedBuilder().setColor(embedColors.red).setTitle('Whoops!').setDescription("You don't have the permissions to do that.\n**Required Permissions:**\n- `Mute Members`\n- `Initially add the bot to the voice channel`")],
        ephemeral: isHidden
      });
    }
    } catch(e) {
      console.error(e);
      await interaction.reply({ embeds: [
        new EmbedBuilder().setColor(embedColors.red).setTitle('Whoops!').setDescription("The bot isn't in a voice channel!")
      ], ephemeral: isHidden });
    }
    }
  if (interaction.commandName == 'reviews') {
    reviewNum++;
    var reviews = await fetch('https://store.steampowered.com/appreviews/1686940?json=1');
    reviews = JSON.parse(await reviews.text());
    console.log(reviews);
    await interaction.reply({ embeds: [
      new EmbedBuilder().setColor(embedColors.boplYellow).setTitle(`${reviews.reviews[reviewNum].votes_up} 👍 | ${reviews.reviews[reviewNum].votes_funny} 🤡 - ${reviews.reviews[reviewNum].author.playtime_forever} hours total`).setURL(`https://steamcommunity.com/profiles/${reviews.reviews[reviewNum].author.steamid}/recommended/${reviews.reviews[reviewNum].recommendationid}`).setDescription(reviews.reviews[reviewNum].review)
    ], ephemeral: isHidden });
    }
    if (!isTimedOut) {
      isTimedOut = true;
      setTimeout(()=>{reviewNum = -1},480000)
    }
});
// lets get it started 🔥🔥🔥🔥🔥🔥
client.login(TOKEN);

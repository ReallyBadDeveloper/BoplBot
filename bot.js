// add .env data
const dotenv = require('dotenv').config();
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const { EmbedBuilder, SlashCommandStringOption, ActionRowBuilder, ButtonBuilder, ButtonStyle, } = require('discord.js');
const { REST, Routes, SlashCommandBuilder } = require('discord.js');
//const { createAudioPlayer, noSubscriberBehavior, joinVoiceChannel, createAudioResource } = require('@discordjs/voice');
const { abilities } = require('./abilities');
const fs = require('fs');
const path = require('path');
var configFile;
var dev = true;
var embedColors = {
  boplYellow: 0xfefe66,
  green: 0x54ff47,
  orange: 0xd99f3b,
  red: 0xbf2626,
};

var randomArr = function(arr) {
    // console.log((Math.random(1,arr.length+1) * 10).toFixed(0));
    return arr[(Math.random(1,arr.length+1) * 10).toFixed(0)];
}

var commandsList = [
  ['random-combo','Sends a random combination of Bopl Battle abilities!'],
  ['abilities','Displays every ability in Bopl Battle!'],
  ['help','Provides help while using Bopl Bot.'],
  ['ping','Checks to see if the bot is online.'],
  ['music','Plays Bopl Battle music in your current voice channel!']
]

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
] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('Bopl Battle!', { type: ActivityType.Playing});
  if (!dev) {
    client.channels.fetch('1236702177515409469').then(channel=>channel.send({
      embeds: [
        new EmbedBuilder().setColor(embedColors.green).setTitle('Bot is online! :wireless:').setDescription("Currently being hosted on Really Bad Dev's computer!")
      ]
    }));
  }
});

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

    interaction.reply({ embeds: [
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
    interaction.reply({ embeds: [
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
    interaction.reply(
        {
            embeds: [new EmbedBuilder().setColor(embedColors.boplYellow).setTitle('Commands').setDescription(cmdString)],
            ephemeral: isHidden,
        }
    );
  }
  if (interaction.commandName == 'ping') {
    interaction.reply({
      embeds: [
        new EmbedBuilder().setColor(embedColors.green).setTitle('Pong! :ping_pong:')
      ],
      ephemeral: isHidden,
    });
  }
  /* if (interaction.commandName == 'music') {
        var connection = joinVoiceChannel({
          channelId: interaction.member.voice.channel,
          guildId: interaction.guildId,
          adapterCreator: interaction.guild.voiceAdapterCreator,
        });
        console.log('1');
        const player = createAudioPlayer();
        console.log('2');
        const resource = createAudioResource('/media/music.mp3');
        console.log('3');
        connection.subscribe(player);
        console.log('4');
        player.play(resource);
        console.log('5');
        interaction.reply({content: 'Okay!', ephemeral: isHidden});
        console.log('Finished!');
    } */
});
// lets get it started 🔥🔥🔥🔥🔥🔥
client.login(TOKEN);

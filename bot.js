// add .env data
const dotenv = require('dotenv').config();
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const { EmbedBuilder, SlashCommandStringOption, Colors } = require('discord.js');
const { REST, Routes, SlashCommandBuilder } = require('discord.js');
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
    console.log((Math.random(1,arr.length+1) * 10).toFixed(0));
    return arr[(Math.random(1,arr.length+1) * 10).toFixed(0)];
}


const commands = [
  new SlashCommandBuilder().setName('random-combo').setDescription('Sends a random combination of Bopl Battle abilities!'),
  new SlashCommandBuilder().setName('abilities').setDescription('Displays every ability in Bopl Battle!'),
  new SlashCommandBuilder().setName('help').setDescription('Provides help while using Bopl Bot.'),
  new SlashCommandBuilder().setName('ping').setDescription('Checks to see if the bot is online.')
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

try {
  console.log('Started refreshing application (/) commands.');

  rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}
const { Client, GatewayIntentBits, channel, ActivityType } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('Bopl Battle!', { type: ActivityType.Playing});
  if (!dev) {
    client.channels.fetch('1236702177515409469').then(channel=>channel.send({
      embeds: [
        new EmbedBuilder().setColor(0x54ff47).setTitle('Bot is online! :wireless:').setDescription("Currently being hosted on Really Bad Dev's computer!")
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

    interaction.reply({ content: `${ability1} ${ability2} ${ability3}`, ephemeral: isHidden });
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
    interaction.reply({ content: emojiString, ephemeral: isHidden });
  }
  if (interaction.commandName == 'help') {
    interaction.reply(
        {
            //content: '# Commands\n- `/help` - Shows this message.\n- `/random-combo` - Gives you three random Bopl Battle abilities to use in-game.\n- `/abilities` - Gives you every ability in Bopl Battle.',
            embeds: [new EmbedBuilder().setColor(0xfefe66).setTitle('Commands').setDescription('- `/help` - Shows this message.\n- `/random-combo` - Gives you three random Bopl Battle abilities to use in-game.\n- `/abilities` - Gives you every ability in Bopl Battle.')],
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
});

// lets get it started 🔥🔥🔥🔥🔥🔥
client.login(TOKEN);
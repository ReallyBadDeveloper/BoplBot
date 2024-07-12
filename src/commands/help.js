const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const embedColors = {
  boplYellow: 0xfefe66,
};

const commandsList = [
  ['random-combo', 'Sends a random combination of Bopl Battle abilities!'],
  ['abilities', 'Displays every ability in Bopl Battle!'],
  ['help', 'This command.'],
  ['ping', 'Provides uptime info about Bopl Bot.'],
  ['music', 'Plays Bopl Battle music in your current voice channel!'],
  ['disconnect', 'Disconnects Bopl Bot from your voice channel.'],
  ['reviews', 'Gets the Steam reviews for Bopl Battle!'],
  ['boplprofile', 'Makes a custom Bopl-themed profile picture!'],
  ['echo', 'Says something as Bopl Bot in different channels!'],
  ['info', 'Provides general info about the bot.'],
  ['friendcodes get', `Gets a user's Steam friendcode.`],
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Provides help while using Bopl Bot.'),
  async execute(interaction) {
    var cmdString = commandsList.map(cmd => `- \`/${cmd[0]}\` - ${cmd[1]}\n`).join('');
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(embedColors.boplYellow)
          .setTitle('Commands')
          .setDescription(cmdString),
      ],
      ephemeral: true,
    });
  },
};

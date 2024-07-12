const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { exec } = require('child_process');
const embedColors = {
  green: 0x54ff47,
  red: 0xbf2626,
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('restart')
    .setDescription('Restarts the bot.'),
  async execute(interaction) {
    try {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(embedColors.green)
            .setTitle('Restarting...')
            .setDescription('The bot will restart shortly.'),
        ],
        ephemeral: true,
      });

      exec('pm2 restart BoplBot');
    } catch (error) {
      console.error(error);
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(embedColors.red)
            .setTitle('Error')
            .setDescription('There was an error while trying to restart the bot.'),
        ],
        ephemeral: true,
      });
    }
  },
};

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const embedColors = require("../embedColors.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Provides uptime info about Bopl Bot.'),
  async execute(interaction) {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(embedColors.green)
          .setTitle('Pong! :ping_pong:')
          .setDescription(`
            **Response Ping:** ${Date.now() - interaction.createdTimestamp} ms\n
            **API Ping:** ${interaction.client.ws.ping} ms\n
            **Bot Uptime:** ${(Math.floor(process.uptime()) / 3600).toFixed(4)} hours
          `),
      ],
      ephemeral: true,
    });
  },
};

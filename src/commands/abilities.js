const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { abilities } = require('../abilities');
const embedColors = require("../embedColors.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('abilities')
    .setDescription('Displays every ability in Bopl Battle!'),
  async execute(interaction) {
    var emojiString = abilities.map((emoji) => `${interaction.client.emojis.cache.get(emoji)} `).join('');
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(embedColors.boplYellow)
          .setTitle('Abilities')
          .setDescription(emojiString),
      ],
      ephemeral: true,
    });
  },
};

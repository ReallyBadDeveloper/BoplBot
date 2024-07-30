const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { abilities } = require('../abilities');
const embedColors = require("../embedColors.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('random-combo')
    .setDescription('Sends a random combination of Bopl Battle abilities!'),
  async execute(interaction) {
    var selectedAbilities = [];
    while (selectedAbilities.length < 3) {
      var selected = abilities[Math.floor(Math.random() * abilities.length)];
      if (!selectedAbilities.includes(selected)) selectedAbilities.push(selected);
    }
    var emojiString = selectedAbilities.map((emoji) => `${interaction.client.emojis.cache.get(emoji)} `).join('');

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(embedColors.boplYellow)
          .setTitle('Random Combo')
          .setDescription(emojiString),
      ],
      ephemeral: true,
    });
  },
};

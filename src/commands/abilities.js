const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { abilities } = require('../abilities');
const embedColors = require("../embedColors.js")
const ephemeralifier = require('../ephemeralifier.js')

let emojiString = undefined
module.exports = {
  data: new SlashCommandBuilder()
    .setName('abilities')
    .setDescription('Displays every ability in Bopl Battle!'),
  async execute(interaction) {
    if(emojiString==undefined)emojiString = abilities.map((emoji) => `${interaction.client.emojis.cache.get(emoji)} `).join('');

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(embedColors.boplYellow)
          .setTitle('Abilities')
          .setDescription(emojiString),
      ],
      ephemeral: ephemeralifier.isHidden(interaction),
    });
  },
};

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const embedColors = require("../embedColors.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Provides general info about the bot.'),
  async execute(interaction) {
    var bheart = interaction.client.emojis.cache.get('1258056142442201178');
    var botInfo = `- **Developer:** ReallyBadDev\n- **Version:** 1.3.0\n- **Prefix:** \`/\``;
    var moreInfo = `
      If you need any additional help, please contact <@458148120682045460> or send a message to the bot directly.
      ${bheart}
    `;
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(embedColors.boplYellow)
          .setTitle('Bopl Bot Info')
          .setDescription(botInfo)
          .addFields({ name: 'More Info', value: moreInfo }),
      ],
      ephemeral: true,
    });
  },
};

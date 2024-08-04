const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const embedColors = require("../embedColors.js")
const ephemeralifier = require('../ephemeralifier.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('echo')
    .setDescription('Says something as Bopl Bot in this channel!')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('The message to send. Note: Most Markdown breaks the message.')
        .setRequired(true)
        .setMaxLength(1000)
    ),
  async execute(interaction) {
    const message = interaction.options.getString('message');

    if (message.includes('<@&') || message.includes('@everyone') || message.includes('@here')) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(embedColors.red)
            .setTitle('Nope!')
            .setDescription('You cannot mention roles, `@everyone`, or `@here`.'),
        ],
        ephemeral: true,
      });
      return;
    }

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(embedColors.green)
          .setTitle('Success!')
          .setDescription('Message should be sent shortly!'),
      ],
      ephemeral: true,
    });

    interaction.channel.send({ content: `### <@${interaction.user.id}> says:\n${message}` });
  },
};

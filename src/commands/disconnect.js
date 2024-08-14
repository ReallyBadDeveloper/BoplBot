const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const embedColors = require("../embedColors.js")
const ephemeralifier = require('../ephemeralifier.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('disconnect')
    .setDescription('Disconnects Bopl Bot from your voice channel.'),
  async execute(interaction) {
    const connection = interaction.client.connection;
    const connector = interaction.client.connector;

    try {
      if (
        interaction.user.id == connector ||
        interaction.member.permissions.has(PermissionsBitField.Flags.MuteMembers)
      ) {
        connection.disconnect();
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(embedColors.green)
              .setTitle('Success!')
              .setDescription('Successfully left the voice channel!'),
          ],
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(embedColors.red)
              .setTitle('Whoops!')
              .setDescription("You don't have the permissions to do that.\n**Required Permissions:**\n- `Mute Members`\n- `Initially add the bot to the voice channel`"),
          ],
          ephemeral: true,
        });
      }
    } catch (e) {
      console.error(e);
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(embedColors.red)
            .setTitle('Whoops!')
            .setDescription("The bot isn't in a voice channel!"),
        ],
        ephemeral: true,
      });
    }
  },
};

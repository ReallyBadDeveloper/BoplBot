const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const friendcodes = require('../friendcodes');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('friendcodes')
    .setDescription('A command category for friendcodes.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('get')
        .setDescription('Gets a user\'s Steam friendcode.')
        .addUserOption(option =>
          option.setName('user')
            .setDescription('The user')
        )
    ),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const friendcode = friendcodes.get(user.id);
    await interaction.reply({
      content: `Friendcode for ${user.username}: ${friendcode}`,
      ephemeral: true,
    });
  },
};

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { GetCode, SetCode } = require('../database');
const embedColors = require("../embedColors.js")
const ephemeralifier = require('../ephemeralifier.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('friendcode')
    .setDescription('Manage friend codes.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('get')
        .setDescription('Get a user\'s friend code.')
        .addUserOption(option => 
          option.setName('user')
            .setDescription('The user whose friend code you want to get')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('set')
        .setDescription('Set your friend code.')
        .addNumberOption(option => 
          option.setName('code')
            .setDescription('Your friend code')
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'get') {
      const user = interaction.options.getUser('user');
      const friendCode = GetCode(user.id);
      if (friendCode) {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(embedColors.green)
              .setTitle(`${user.username}'s Friend Code`)
              .setDescription(`${user.username}'s friend code is: ${friendCode}`)
          ],
          ephemeral: ephemeralifier.isHidden(interaction),
        });
      } else {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(embedColors.red)
              .setTitle('No Friend Code Found')
              .setDescription(`${user.username} has not set a friend code yet.`)
          ],
          ephemeral: ephemeralifier.isHidden(interaction),
        });
      }
    } else if (subcommand === 'set') {
      const friendCode = interaction.options.getString('code');
      if(friendCode.toString().length>=15){
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(embedColors.red)
              .setTitle('Friend Code Not Set')
              .setDescription(`Your friend code exceeded the max length of 15 digits.`)
          ],
          ephemeral: ephemeralifier.isHidden(interaction),
        });

        return
      }
      SetCode(interaction.user.id, friendCode);
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(embedColors.green)
            .setTitle('Friend Code Set')
            .setDescription(`Your friend code has been set to: ${friendCode}`)
        ],
        ephemeral: ephemeralifier.isHidden(interaction),
      });
    }
  },
};

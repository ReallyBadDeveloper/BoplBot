const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { createAudioPlayer, joinVoiceChannel, createAudioResource } = require('@discordjs/voice');
const embedColors = require("../embedColors.js")
const ephemeralifier = require('../ephemeralifier.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('music')
    .setDescription('Plays Bopl Battle music in your current voice channel!')
    .addStringOption(option =>
      option.setName('track')
        .setDescription('The track to play')
        .setRequired(true)
        .addChoices(
          { name: 'Battle Theme', value: 'battle_theme' },
          { name: 'Menu Theme', value: 'menu_theme' },
        )
    ),
  async execute(interaction) {
    const track = interaction.options.getString('track');
    const connection = interaction.client.connection;
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(embedColors.red)
            .setTitle('Error')
            .setDescription('You need to be in a voice channel to use this command.'),
        ],
        ephemeral: ephemeralifier.isHidden(interaction ),
      });
      return;
    }

    if (!voiceChannel.joinable) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(embedColors.red)
            .setTitle('Error')
            .setDescription('I cannot join your voice channel.'),
        ],
        ephemeral: ephemeralifier.isHidden(interaction ),
      });
      return;
    }

    if (!connection) {
      const newConnection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

      interaction.client.connection = newConnection;
    }

    const resource = createAudioResource(`./media/music/${track}.mp3`);
    const player = createAudioPlayer();

    player.play(resource);
    interaction.client.connection.subscribe(player);

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(embedColors.green)
          .setTitle('Playing Music')
          .setDescription(`Now playing: ${track.replace('_', ' ')}`),
      ],
      ephemeral: ephemeralifier.isHidden(interaction ),
    });
  },
};

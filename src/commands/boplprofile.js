const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const { request } = require('undici');
const embedColors = {
  boplYellow: 0xfefe66,
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('boplprofile')
    .setDescription('Makes a custom Bopl-themed profile picture!')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to grab the profile of. Defaults to you.')
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    var canvas = Canvas.createCanvas(1080 / 2, 1080 / 2);
    var ctx = canvas.getContext('2d');
    var user = interaction.options.getUser('user') || interaction.user;
    var template = await Canvas.loadImage('https://github.com/ReallyBadDeveloper/BoplBot/blob/main/media/pfp/template.png?raw=true');
    var bg = await Canvas.loadImage('https://github.com/ReallyBadDeveloper/BoplBot/blob/main/media/pfp/bg.png?raw=true');

    const { body } = await request(user.displayAvatarURL({ extension: 'png' }));
    const avatar = await Canvas.loadImage(await body.arrayBuffer());

    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(avatar, 161 / 2, 115 / 2, 780 / 2, 780 / 2);
    ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

    const attachment = new AttachmentBuilder(await canvas.encode('png'), {
      name: 'profile.png',
    });

    await interaction.editReply({
      files: [attachment],
      ephemeral: true,
    });
  },
};

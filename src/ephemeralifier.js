exports.isHidden = (interaction) => {
    if (interaction.channel.name.includes('commands') || interaction.channel.name.includes('bot')) {
        return false;
    } else {
        return true;
    }
}
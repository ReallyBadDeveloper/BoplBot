const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
// const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reviews')
        .setDescription('Gets the Steam reviews for Bopl Battle!'),

    async execute(interaction) {
        let reviewNum = -1;
        const isHidden = false; 

        try {
            const response = await fetch('https://store.steampowered.com/appreviews/1686940?json=1');
            const reviews = await response.json();

            reviewNum++; 

            if (reviewNum >= reviews.reviews.length) {
                reviewNum = 0; 
            }

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xfefe66) 
                        .setTitle(`${reviews.reviews[reviewNum].votes_up} 👍 | ${reviews.reviews[reviewNum].votes_funny} 🤡 - ${reviews.reviews[reviewNum].author.playtime_forever} hours total`)
                        .setURL(`https://steamcommunity.com/profiles/${reviews.reviews[reviewNum].author.steamid}/recommended/${reviews.reviews[reviewNum].recommendationid}`)
                        .setDescription(reviews.reviews[reviewNum].review)
                ],
                ephemeral: isHidden 
            });

        } catch (error) {
            console.error('Error fetching Steam reviews:', error);
            await interaction.reply({
                content: 'Failed to fetch Steam reviews.',
                ephemeral: isHidden 
            });
        }
    },
};

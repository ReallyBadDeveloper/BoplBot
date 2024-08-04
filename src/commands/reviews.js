const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const ephemeralifier = require('../ephemeralifier.js')
// const fetch = require('node-fetch');

// Review caching/updating system thingy.
let reviews = {}
let lastReviewUpdate = 0;
async function tryUpdateReviews(){
    if(lastReviewUpdate+60000>Date.now())return
    lastReviewUpdate = Date.now()
    let response = await fetch('https://store.steampowered.com/appreviews/1686940?json=1');
    reviews = await response.json();
}
tryUpdateReviews()

let reviewNum = -1;
module.exports = {
    data: new SlashCommandBuilder()
        .setName('reviews')
        .setDescription('Gets the Steam reviews for Bopl Battle!'),

    async execute(interaction) {
        const isHidden = false; 

        try {
            tryUpdateReviews() // We don't really need to await because we already have the stuff cached.

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
                ephemeral: ephemeralifier.isHidden(interaction) 
            });

        } catch (error) {
            console.error('Error fetching Steam reviews:', error);
            await interaction.reply({
                content: 'Failed to fetch Steam reviews.',
                ephemeral: ephemeralifier.isHidden(interaction) 
            });
        }
    },
};

const { MessageEmbed } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
// TODO: Communicate with server about leaderboard

module.exports = {
    data: {
        name: 'leaderboard',
        description: 'Get the leaderboard of the playtime on Moonrock',
    },
    async execute(interaction) {
        try {
            console.log("Executing leaderboard command");
            // TODO: Get the leaderboard either from data.db or from remote DB
            // TODO: Get the top 10 users with the most playtime
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            await interaction.reply({ content: 'An error occured while trying to execute this command.', ephemeral: true });
            throw new Error(`An error occured while trying to execute ping command ${error}`);
        };
    },
};
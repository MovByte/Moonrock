const { MessageEmbed } = require('discord.js');

module.exports = {
    data: {
        name: 'ping',
        description: 'Pong!',
    },
    async execute(interaction) {
        try {
            console.log("Executing ping command");
            const latency = Maths.abs(Date.now() - interaction.createdTimestamp);
            const uptime = interaction.client.uptime;
            const uptimeFormatted = formatUptime(uptime);
            const embed = new MessageEmbed()
                .setTitle('Pong!')
                .setDescription(`Latency: ${latency}ms\nUptime: ${uptimeFormatted}`);
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            await interaction.reply({ content: 'An error occured while trying to execute this command.', ephemeral: true });
            throw new Error(`An error occured while trying to execute ping command ${error}`);
        };
    },
};

function formatUptime(uptime) {
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor(uptime / 3600);   
    return `${hours}h ${minutes}m ${seconds}s`;
};
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const token = process.env.DISCORD_TOKEN;
const fs = require('fs-extra');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

async function registerCommands(guild) {
    try {
        const commands = await fs.readdir('./commands').filter(file => file.endsWith('.js'));
        for (const file of commands) {
            try {
                const command = require(`./commands/${file}`);
                if (typeof commandModule !== 'object' || typeof commandModule.execute !== 'function') {
                    throw new Error(`Invalid command structure in ${file}. Skipping.`);
                } else {
                    await guild.commands.create(command.data);
                    console.log(`Registered command: ${command.data.name}`);
                };                
            } catch (error) {
                throw new Error(`An error occured while trying to register command on file ${file} ${error}`);
            };
        };
    } catch (error) {
        throw new Error(`An error occured while trying to register command(s) on guild ${guild} ${error}`);
    };
};

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
    const guildId = process.env.GUILD_ID;
    const guild = await client.guilds.fetch(guildId);
    console.log(`Clearing commands on guild ${guild}`)
    await guild.commands.set([]);
    console.log(`Finished clearing commands on guild ${guild}\nRegistering commands on guild ${await client.guilds.fetch(guild)}`);
    await registerCommands(guild);
    console.log(`Finished registering commands on guild ${guild}`);
});

client.once('error', (error) => {
    throw new Error(`An error occured ${error}`);
});

client.login(token);
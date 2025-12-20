const { REST, Routes } = require('discord.js');
const nymoCommand = require('./bot');

async function registerCommands(token, clientId) {
    const rest = new REST({ version: '10' }).setToken(token);
    try {
        console.log('Refreshing Slash Commands...');
        await rest.put(Routes.applicationCommands(clientId), { body: [nymoCommand] });
        console.log('Slash Commands Registered!');
    } catch (error) {
        console.error(error);
    }
}

module.exports = { registerCommands };

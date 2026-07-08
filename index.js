require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { registerCommands } = require('./commands/register');
const handleInteraction = require('./handlers/interaction');

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

registerCommands(TOKEN, CLIENT_ID);

client.on('interactionCreate', interaction => handleInteraction(interaction, client));
client.once('clientReady', () => console.log(`Logged in as ${client.user.tag}!`));

client.login(TOKEN);

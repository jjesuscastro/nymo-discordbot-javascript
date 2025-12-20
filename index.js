require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
const { registerCommands } = require('./commands/register');
const handleInteraction = require('./handlers/interaction');

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const MONGO_URI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Initialize client
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// Register commands
registerCommands(TOKEN, CLIENT_ID);

// Event handlers
client.on('interactionCreate', interaction => handleInteraction(interaction, client));
client.once('clientReady', () => console.log(`Logged in as ${client.user.tag}!`));

client.login(TOKEN);

const { getConfig } = require('../config');
const handleAdmin = require('./admin');
const handleMessage = require('./message');

async function handleInteraction(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guildId;
    const config = await getConfig(guildId);

    if (['setsecret', 'setalias', 'log'].includes(sub)) {
        return handleAdmin(interaction, config);
    }

    if (sub === 'message') {
        return handleMessage(interaction, config, client);
    }
}

module.exports = handleInteraction;

const { getConfig } = require('../config');
const handleAdmin = require('./admin');
const { handleAliasModal } = require('./admin');
const handleMessage = require('./message');

async function handleInteraction(interaction, client) {
    const guildId = interaction.guildId;
    const config = await getConfig(guildId);

    // Handle modal submissions
    if (interaction.isModalSubmit()) {
        if (interaction.customId.startsWith('setalias_modal_')) {
            return handleAliasModal(interaction, config);
        }
        return;
    }

    if (!interaction.isChatInputCommand()) return;

    const sub = interaction.options.getSubcommand();

    if (['setsecret', 'setalias', 'log'].includes(sub)) {
        return handleAdmin(interaction, config);
    }

    if (sub === 'message') {
        return handleMessage(interaction, config, client);
    }

    if (sub === 'roll') {
        return handleRoll(interaction, config, client);
    }
}

module.exports = handleInteraction;

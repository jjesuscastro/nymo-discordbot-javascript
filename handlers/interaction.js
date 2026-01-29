const { getConfig } = require('../config');
const handleAdmin = require('./admin');
const { handleAliasModal } = require('./admin');
const handleMessage = require('./message');
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

async function handleInteraction(interaction, client) {
    const guildId = interaction.guildId;
    const config = await getConfig(guildId);

    // Handle modal submissions
    if (interaction.isModalSubmit()) {
        if (interaction.customId.startsWith('setalias_modal_')) {
            return handleAliasModal(interaction, config);
        }
        if (interaction.customId === 'nymo_message_modal') {
            return handleMessage(interaction, config, client);
        }
        return;
    }

    if (!interaction.isChatInputCommand()) return;

    const sub = interaction.options.getSubcommand();

    if (['setsecret', 'setalias', 'log'].includes(sub)) {
        return handleAdmin(interaction, config);
    }

    if (sub === 'message') {
        // NEW: Instead of calling handleMessage directly, show the pop-up
        const modal = new ModalBuilder()
            .setCustomId('nymo_message_modal')
            .setTitle('Send Anonymous Message');

        const textInput = new TextInputBuilder()
            .setCustomId('message_text')
            .setLabel("Your Message")
            .setStyle(TextInputStyle.Paragraph) // This allows multiline!
            .setPlaceholder('Type your message here... Use {{n}} to roll dice.')
            .setRequired(true);

        const row = new ActionRowBuilder().addComponents(textInput);
        modal.addComponents(row);

        return await interaction.showModal(modal);
    }
}

module.exports = handleInteraction;

const { getConfig } = require('../config');
const handleAdmin = require('./admin');
const { handleAliasModal } = require('./admin');
const handleMessage = require('./message');
const { handleRingtoss, handleDarts, handleCrane, handleHighstriker, handleLuckyduck, handleSpinthewheel, handleCointoss, handleGameButton } = require('./games');
const { handleFood1, handleFood2, handleBuy } = require('./shop');
const { handleAddMoney, handleDeductTime, handleTravel } = require('./player');
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

async function handleInteraction(interaction, client) {
    // Button interactions
    if (interaction.isButton()) {
        const id = interaction.customId;
        if (id.startsWith('luckyduck_') || id.startsWith('cointoss_')) {
            return handleGameButton(interaction);
        }
        return;
    }

    // Modal submissions
    if (interaction.isModalSubmit()) {
        if (interaction.customId.startsWith('setalias_modal_')) {
            const config = await getConfig(interaction.guildId);
            return handleAliasModal(interaction, config);
        }
        if (interaction.customId === 'nymo_message_modal') {
            const config = await getConfig(interaction.guildId);
            return handleMessage(interaction, config, client);
        }
        return;
    }

    if (!interaction.isChatInputCommand()) return;

    const cmd = interaction.commandName;

    // Anonymous messaging
    if (cmd === 'setsecret' || cmd === 'setalias' || cmd === 'log') {
        const config = await getConfig(interaction.guildId);
        return handleAdmin(interaction, config);
    }

    if (cmd === 'message') {
        const modal = new ModalBuilder()
            .setCustomId('nymo_message_modal')
            .setTitle('Send Anonymous Message');

        const textInput = new TextInputBuilder()
            .setCustomId('message_text')
            .setLabel('Your Message')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Type your message here... Use {{ndn}} to roll dice.')
            .setRequired(true);

        modal.addComponents(new ActionRowBuilder().addComponents(textInput));
        return interaction.showModal(modal);
    }

    // Minigames
    if (cmd === 'ringtoss')    return handleRingtoss(interaction);
    if (cmd === 'darts')       return handleDarts(interaction);
    if (cmd === 'crane')       return handleCrane(interaction);
    if (cmd === 'highstriker') return handleHighstriker(interaction);
    if (cmd === 'luckyduck')   return handleLuckyduck(interaction);
    if (cmd === 'spinthewheel') return handleSpinthewheel(interaction);
    if (cmd === 'cointoss')    return handleCointoss(interaction);

    // Shop
    if (cmd === 'food1')  return handleFood1(interaction);
    if (cmd === 'food2')  return handleFood2(interaction);
    if (cmd === 'buy')    return handleBuy(interaction);

    // Player management
    if (cmd === 'addmoney')    return handleAddMoney(interaction);
    if (cmd === 'checktime')    return handleCheckTime(interaction);
    if (cmd === 'deducttime')  return handleDeductTime(interaction);
    if (cmd === 'travel')      return handleTravel(interaction);
}

module.exports = handleInteraction;

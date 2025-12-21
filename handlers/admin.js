const { PermissionsBitField, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const { isValidImageUrl } = require('../utils/validators');

async function handleAdmin(interaction, config) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return interaction.reply({
            content: "You need Administrator permissions to use this.",
            flags: MessageFlags.Ephemeral
        });
    }

    const sub = interaction.options.getSubcommand();

    // Show modal without deferring first
    if (sub === 'setalias') {
        const secretChannel = interaction.options.getChannel('secretchannel');

        const modal = new ModalBuilder()
            .setCustomId(`setalias_modal_${secretChannel.id}`)
            .setTitle('Set Channel Alias');

        const aliasInput = new TextInputBuilder()
            .setCustomId('alias_input')
            .setLabel('Alias Name')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(32);

        const imageInput = new TextInputBuilder()
            .setCustomId('image_input')
            .setLabel('Image URL (optional)')
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setPlaceholder('https://example.com/image.png');

        const row1 = new ActionRowBuilder().addComponents(aliasInput);
        const row2 = new ActionRowBuilder().addComponents(imageInput);

        modal.addComponents(row1, row2);

        return interaction.showModal(modal);
    }

    if (sub === 'setsecret') {
        const secretChannel = interaction.options.getChannel('secretchannel');
        const publicChannel = interaction.options.getChannel('publicchannel');

        config.secretChannels.set(secretChannel.id, {
            publicChannel: publicChannel.id,
            fakeName: null,
            avatarUrl: null,
            webhookId: null
        });

        await config.save();
        return interaction.reply({ content: `-# Secret channel <#${secretChannel.id}> will relay to <#${publicChannel.id}>` });
    }

    if (sub === 'log') {
        const channel = interaction.options.getChannel('channel');
        config.logChannel = channel.id;
        await config.save();
        return interaction.reply({ content: `-# Log channel set to <#${channel.id}>` });
    }
}

async function handleAliasModal(interaction, config) {
    const customId = interaction.customId;

    if (!customId.startsWith('setalias_modal_')) {
        return;
    }

    const secretChannelId = customId.replace('setalias_modal_', '');
    const alias = interaction.fields.getTextInputValue('alias_input');
    const avatarUrl = interaction.fields.getTextInputValue('image_input') || null;

    // Validate avatar URL if provided
    if (avatarUrl && !isValidImageUrl(avatarUrl)) {
        return interaction.reply({
            content: "❌ Invalid image URL. Must be a direct image link (.png, .jpg, .jpeg, .gif, .webp)",
            flags: MessageFlags.Ephemeral
        });
    }

    const secretConfig = config.secretChannels.get(secretChannelId) || {};
    secretConfig.fakeName = alias;
    secretConfig.avatarUrl = avatarUrl;

    // If a webhook already exists, update it
    if (secretConfig.webhookId) {
        try {
            const webhook = await interaction.client.fetchWebhook(secretConfig.webhookId);
            await webhook.edit({
                name: alias,
                avatar: avatarUrl || undefined
            });
        } catch (err) {
            console.error("Failed to edit webhook:", err);
            // fallback: clear webhookId so a new one will be created next time
            secretConfig.webhookId = null;
        }
    }

    config.secretChannels.set(secretChannelId, secretConfig);
    await config.save();

    return interaction.reply({
        content: `-# Alias for <#${secretChannelId}> set to **${alias}**`
    });
}

module.exports = handleAdmin;
module.exports.handleAliasModal = handleAliasModal;

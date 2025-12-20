const { PermissionsBitField, MessageFlags } = require('discord.js');
const { isValidImageUrl } = require('../utils/validators');

async function handleAdmin(interaction, config) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return interaction.reply({
            content: "You need Administrator permissions to use this.",
            flags: MessageFlags.Ephemeral
        });
    }

    interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const sub = interaction.options.getSubcommand();

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
        return interaction.editReply(`✅ Secret channel <#${secretChannel.id}> will relay to <#${publicChannel.id}>`);
    }

    if (sub === 'setalias') {
        const secretChannel = interaction.options.getChannel('secretchannel');
        const alias = interaction.options.getString('alias');
        const avatarUrl = interaction.options.getString('avatarurl') || null;

        if (avatarUrl && !isValidImageUrl(avatarUrl)) {
            return interaction.editReply("❌ Invalid avatar URL. Must be a direct image link.");
        }

        const secretConfig = config.secretChannels.get(secretChannel.id) || {};
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

        config.secretChannels.set(secretChannel.id, secretConfig);
        await config.save();

        return interaction.editReply(`✅ Alias for <#${secretChannel.id}> set to **${alias}**`);
    }


    if (sub === 'log') {
        const channel = interaction.options.getChannel('channel');
        config.logChannel = channel.id;
        await config.save();
        return interaction.editReply(`✅ Log channel set to <#${channel.id}>`);
    }
}

module.exports = handleAdmin;

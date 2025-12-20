const { MessageFlags } = require('discord.js');

async function handleMessage(interaction, config, client) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const text = interaction.options.getString('text');
    const secretChannelId = interaction.channelId;
    const secretConfig = config.secretChannels.get(secretChannelId);

    if (!secretConfig) {
        return interaction.editReply("❌ This channel is not configured as a secret channel.");
    }

    const { publicChannel, fakeName, webhookId } = secretConfig;
    const publicChan = client.channels.cache.get(publicChannel);

    let webhook;
    if (webhookId) {
        try {
            webhook = await client.fetchWebhook(webhookId);
        } catch {
            secretConfig.webhookId = null;
            await config.save();
        }
    }

    if (!webhook) {
        webhook = await publicChan.createWebhook({
            name: fakeName || "Anonymous",
            avatar: secretConfig.avatarUrl || undefined
        });
        secretConfig.webhookId = webhook.id;
        await config.save();
    }

    await webhook.send({ content: text });

    // Send a visible message in the secret channel
    const secretChan = client.channels.cache.get(secretChannelId);
    if (secretChan) {
        await secretChan.send({
            content: `>>> **${fakeName}**\n${text}\n*Sent to <#${publicChannel}>*`
        });
    }

    if (config.logChannel) {
        const logChan = client.channels.cache.get(config.logChannel);
        if (logChan) {
            await logChan.send({
                content: `>>> 🛡️ **Log**\n`
                    + `**User:** ${interaction.user.tag} (${interaction.user.id})\n`
                    + `**Alias:** ${fakeName}\n`
                    + `**Secret Channel:** <#${secretChannelId}>\n`
                    + `**Public Channel:** <#${publicChannel}>\n`
                    + `**Content:** ${text}`
            });
        }
    }

    return interaction.editReply(`✅ Your message was sent to <#${publicChannel}> as **${fakeName || "Anonymous"}**`);
}

module.exports = handleMessage;

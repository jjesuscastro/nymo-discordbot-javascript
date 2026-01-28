const { MessageFlags } = require('discord.js');

async function handleRoll(interaction, config, client) {
    const count = interaction.options.getNumber('count') || 1;
    const secretChannelId = interaction.channelId;
    const secretConfig = config.secretChannels.get(secretChannelId);

    if (!secretConfig) {
        return interaction.reply({
            content: "❌ This channel is not configured as a secret channel.",
            flags: MessageFlags.Ephemeral
        });
    }

    if (count <= 0) {
        return interaction.reply({
            content: "❌ Count must be at least 1.",
            flags: MessageFlags.Ephemeral
        });
    }

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const { publicChannel, fakeName, webhookId, avatarUrl } = secretConfig;
    const publicChan = await client.channels.fetch(publicChannel);

    let webhook;
    try {
        if (webhookId) webhook = await client.fetchWebhook(webhookId);
    } catch {
        secretConfig.webhookId = null;
    }

    if (!webhook) {
        webhook = await publicChan.createWebhook({
            name: fakeName || "Anonymous",
            avatar: avatarUrl || undefined
        });
        secretConfig.webhookId = webhook.id;
        await config.save();
    }

    const results = Array.from({ length: count }, () => Math.floor(Math.random() * 20) + 1);
    const resultString = results.join(', ');
    const finalContent = `Rolled ${count === 1 ? 'a' : ''} ${resultString}.`;

    try {
        await webhook.send({ content: finalContent });

        await interaction.editReply({
            content: `✅ Sent to <#${publicChannel}>\n>>> **${fakeName}**\n${finalContent}`
        });

        if (config.logChannel) {
            const logChan = client.channels.cache.get(config.logChannel);
            if (logChan) {
                await logChan.send({
                    content: `>>> 🛡️ **Log**\n**User:** ${interaction.user.tag}\n**Alias:** ${fakeName}\n**Target:** <#${publicChannel}>\n**Rolls:** ${resultString}`
                });
            }
        }
    } catch (err) {
        console.error(err);
        await interaction.editReply("⚠️ Failed to send roll. Check my permissions.");
    }
}

module.exports = handleRoll;
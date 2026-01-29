const { MessageFlags } = require('discord.js');

async function handleMessage(interaction, config, client) {
    // UPDATED: Get text from the modal field instead of command options
    let text = interaction.fields.getTextInputValue('message_text');

    const secretChannelId = interaction.channelId;
    const secretConfig = config.secretChannels.get(secretChannelId);

    if (!secretConfig) {
        // Note: For modals, we use reply because it's the first response
        return interaction.reply({ content: "❌ This channel is not configured as a secret channel.", flags: MessageFlags.Ephemeral });
    }

    // --- Dice Rolling Logic (Stays the same!) ---
    const diceRegex = /\{\{(\d+)\}\}/;
    const match = text.match(diceRegex);

    if (match) {
        const numDice = parseInt(match[1]);
        const rolls = [];
        const safeNumDice = Math.min(numDice, 20);

        for (let i = 0; i < safeNumDice; i++) {
            const roll = Math.floor(Math.random() * 20) + 1;
            rolls.push(`\` 🎲${roll} \``);
        }
        text = text.replace(diceRegex, rolls.join(' '));
    }

    const { publicChannel, fakeName, webhookId } = secretConfig;
    const publicChan = client.channels.cache.get(publicChannel);

    // Defer reply because webhooks can be slow
    await interaction.deferReply({ ephemeral: true });

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

    await interaction.editReply({ content: "✅ Message sent with dice rolls!" });
}

module.exports = handleMessage;
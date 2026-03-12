const { MessageFlags } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

async function handleMessage(interaction, config, client) {
    let text = interaction.fields.getTextInputValue('message_text');

    const secretChannelId = interaction.channelId;
    const secretConfig = config.secretChannels.get(secretChannelId);

    if (!secretConfig) {
        return interaction.reply({ content: "❌ This channel is not configured as a secret channel.", flags: MessageFlags.Ephemeral });
    }

    const diceRegex = /\{\{(\d+)[d](\d+)(\-?\+?)(\d?)(k?)(\d?)\}\}/;
    const match = text.match(diceRegex);

    if (match) {
        const numDice = parseInt(match[1]);
        const sideDice = parseInt(match[2]);
        const diceModifier = match[3];
        const numModifier = parseInt(match[4]);
        const keep = match[5];
        const keepNum = parseInt(match[6]);
        const rolls = [];
        const rolls2 = [];
        var total = 0;

        for (let i = 0; i < numDice; i++) {
            const roll = Math.floor(Math.random() * sideDice) + 1;
            rolls2.push(roll);
            total+=roll;
        }
        
        // if(keep){
        //         total = 0;
        //         var tempRolls = rolls2.slice();
        //         let tempMax = 0;
        //         for(let i = 0; i < keepNum; i++){
        //             tempMax = Math.max(tempRolls);
        //             total += tempMax;
        //             var maxindex = tempRolls.indexOf(tempMax);
        //             tempRolls.splice(1,maxindex);
        //             rolls2[maxindex] = rolls[maxindex].toString()+"d";
        //     }
        // }

        if(diceModifier){
            if (diceModifier.toString() == "+"){
                total += numModifier;
            }
            if (diceModifier.toString() == "-"){
                total -= numModifier;
            }
        }

        rolls.push(`\`🎲${total}\``);
            
        text = text.replace(diceRegex, rolls.join(' '));

        const match2 = match[0].toString();
        var diceRoll = match2.substring(2, match2.length-2);

        var line1 = "Rolled: " + diceRoll;
        var line2 = "[" + rolls2 + "]";
        if (diceModifier.toString() == "+"){
            line2 += "+" + numModifier;
        }
        if (diceModifier.toString() == "-"){
            line2 += "-" + numModifier;
        }
        line2 += " ➜ " + total;

        const diceEmbed = new EmbedBuilder()
            .addFields(
                { name: line1, value: line2}
            );

        text += "\n > " + "**Rolled: ";
        text += diceRoll + "**";
        text += "\n > -# " + "[" + rolls2 + "]";
        if (diceModifier.toString() == "+"){
            text += "+" + numModifier;
        }
        if (diceModifier.toString() == "-"){
            text += "-" + numModifier;
        }
        text += " ➜ " + total;
    }

    const { publicChannel, fakeName, webhookId } = secretConfig;
    const publicChan = client.channels.cache.get(publicChannel);

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

    if(diceEmbed)
        await webhook.send({ content: text, embed: diceEmbed });
    else
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
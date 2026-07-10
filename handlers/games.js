const { MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { getProfile, saveProfile } = require('../services/profiles');
const { getStall, addToInventory } = require('../services/shop');
const { getHighscore, saveHighscore } = require('../services/game_stats');

function rollD(sides) {
    return Math.floor(Math.random() * sides) + 1;
}

async function requireTime(interaction, discordId, minutes) {
    const profile = await getProfile(discordId);
    if (!profile) {
        await interaction.editReply({ content: '❌ You don\'t have a profile set up yet.' });
        return null;
    }
    if (profile.time < minutes) {
        const embed = new EmbedBuilder()
                .setTitle('🎭 Uh oh!')
                .setColor(0xE63C3C)
                .setDescription(`❌ Not enough time. You need **${minutes} minutes** to play this game.\n There are **${profile.time} minutes** left on the clock`);

        return interaction.editReply({ embeds: [embed] });
        return null;
    }
    return profile;
}

// --- Precision Games---

async function handleRingtoss(interaction) {
    await interaction.deferReply();
    const profile = await requireTime(interaction, interaction.user.id, 5);
    if (!profile) return;

    const rolls = Array.from({ length: 20 }, () => rollD(20));
    const score = rolls.filter(r => r > 13).length;
    profile.time -= 5;
    await saveProfile(profile);
    var hstext = "Looks like you didn't beat the highscore...";
    const prev = await getHighscore('ringtoss', interaction.user.id);
    if (score > prev) {
        await saveHighscore('ringtoss', interaction.user.id, score);
        hstext = "\:trophy\: Congratulations! You now hold the highscore.";
    }
    
    const embed = new EmbedBuilder()
        .setTitle('⭕ Ring Toss')
        .setDescription('Throw 20 rings into the pegs! Roll above a 13 to score.')
        .addFields(
            { name: 'Rolls', value: rolls.join(', ') },
            { name: 'Score', value: String(score), inline: true },
            { name: 'Personal Best', value: String(Math.max(score, prev)), inline: true },
            { name: 'Time Remaining', value: `${profile.time} min`, inline: true },
            { name: `${hstext}`, value: ' ', inline: false }
        );
    return interaction.editReply({ embeds: [embed] });
}

async function handleDarts(interaction) {
    await interaction.deferReply();
    const profile = await requireTime(interaction, interaction.user.id, 5);
    if (!profile) return;

    const rolls = Array.from({ length: 10 }, () => rollD(20));
    const score = rolls.filter(r => r > 15).length;
    profile.time -= 5;
    await saveProfile(profile);
    var hstext = "Looks like you didn't beat the highscore...";
    
    const prev = await getHighscore('darts', interaction.user.id);
    if (score > prev){
        await saveHighscore('darts', interaction.user.id, score);
        hstext = "\:trophy\: Congratulations! You now hold the highscore.";
    }

    const embed = new EmbedBuilder()
        .setTitle('🎯 Dart Throwing')
        .setDescription('Pop the balloons! You have 10 darts. Roll above a 15 to score.')
        .addFields(
            { name: 'Rolls', value: rolls.join(', ') },
            { name: 'Score', value: String(score), inline: true },
            { name: 'Personal Best', value: String(Math.max(score, prev)), inline: true },
            { name: 'Time Remaining', value: `${profile.time} min`, inline: true },
            { name: `${hstext}`, value: ' ', inline: false }
        );
    return interaction.editReply({ embeds: [embed] });
}

async function handleClown(interaction) {
    await interaction.deferReply();
    const profile = await requireTime(interaction, interaction.user.id, 5);
    if (!profile) return;

    const rolls = Array.from({ length: 10 }, () => rollD(20));
    const score = rolls.filter(r => r > 13).length;
    profile.time -= 5;
    await saveProfile(profile);
    var hstext = "Looks like you didn't beat the highscore...";
    
    const prev = await getHighscore('clown', interaction.user.id);
    if (score > prev){
        await saveHighscore('clown', interaction.user.id, score);
        hstext = "\:trophy\: Congratulations! You now hold the highscore.";
    }

    const embed = new EmbedBuilder()
        .setTitle('🤡 Clown Tooth Knockout')
        .setDescription('Knock some teeth out with beanbags! You have 10 bags. Roll above a 13 to score.')
        .addFields(
            { name: 'Rolls', value: rolls.join(', ') },
            { name: 'Score', value: String(score), inline: true },
            { name: 'Personal Best', value: String(Math.max(score, prev)), inline: true },
            { name: 'Time Remaining', value: `${profile.time} min`, inline: true },
            { name: `${hstext}`, value: ' ', inline: false }
        );
    return interaction.editReply({ embeds: [embed] });
}

async function handleSunkDuck(interaction) {
    await interaction.deferReply();
    const profile = await requireTime(interaction, interaction.user.id, 5);
    if (!profile) return;

    const rolls = Array.from({ length: 20 }, () => rollD(20));
    const score = rolls.filter(r => r > 10).length;
    profile.time -= 5;
    await saveProfile(profile);
    var hstext = "Looks like you didn't beat the highscore...";
    const prev = await getHighscore('duck', interaction.user.id);
    if (score > prev) {
        await saveHighscore('duck', interaction.user.id, score);
        hstext = "\:trophy\: Congratulations! You now hold the highscore.";
    }
    if (score > 6){
        hstext += "\nYou received a food voucher worth $5!";
        await addToInventory(interaction.user.id, "$5 food voucher", 1);
    }
    
    const embed = new EmbedBuilder()
        .setTitle('🦆 Sunk A Duck')
        .setDescription('Throw balls and sink some ducks! Roll above a 10 to score.')
        .addFields(
            { name: 'Rolls', value: rolls.join(', ') },
            { name: 'Score', value: String(score), inline: true },
            { name: 'Personal Best', value: String(Math.max(score, prev)), inline: true },
            { name: 'Time Remaining', value: `${profile.time} min`, inline: true },
            { name: `${hstext}`, value: ' ', inline: false }
        );
    return interaction.editReply({ embeds: [embed] });
}

async function handleCrane(interaction) {
    await interaction.deferReply();
    const profile = await requireTime(interaction, interaction.user.id, 1);
    if (!profile) return;

    var stock = await getHighscore('crane', interaction.user.id);
    
    if(stock === 0){
        const embed = new EmbedBuilder()
                .setTitle('🎭 Uh oh!')
                .setColor(0xE63C3C)
                .setDescription(`Looks like there aren't any prizes left in the claw machine.`);
        return interaction.editReply({ embeds: [embed] });
    }

    const roll = rollD(20);
    const win = roll === 13;
    profile.time -= 1;
    await saveProfile(profile);

    let prize = null;
    if (win) {
        await addToInventory(interaction.user.id, "$15 food voucher", 1);
        stock--;
        await saveHighscore('crane', interaction.user.id, stock);
    }

    const embed = new EmbedBuilder()
        .setTitle('🧸 Crane Game')
        .addFields(
            { name: 'Roll', value: String(roll), inline: true },
            { name: 'Time Remaining', value: `${profile.time} min`, inline: true },
            { name: win ? `🎉 You did it! You got a teddy bear!\nAttached to the bear is a $15 food voucher.` : '❌ Better luck next time.', value: ' ', inline: false },
            { name: ' ', value: win ? `Looks like there's only ${stock} left` : '', inline: false }
        );
    return interaction.editReply({ embeds: [embed] });
}

async function handleHighstriker(interaction) {
    await interaction.deferReply();
    const profile = await requireTime(interaction, interaction.user.id, 2);
    if (!profile) return;

    const score = rollD(100);
    profile.time -= 2;
    await saveProfile(profile);

    const prev = await getHighscore('highstriker', interaction.user.id);
    if (score > prev) await saveHighscore('highstriker', interaction.user.id, score);

    const embed = new EmbedBuilder()
        .setTitle('🔨 High Striker')
        .addFields(
            { name: 'Score', value: String(score), inline: true },
            { name: 'Personal Best', value: String(Math.max(score, prev)), inline: true },
            { name: 'Time Remaining', value: `${profile.time} min`, inline: true }
        );
    return interaction.editReply({ embeds: [embed] });
}

async function handleLuckyduck(interaction) {
    await interaction.deferReply({ flags: 64 });
    const profile = await requireTime(interaction, interaction.user.id, 3);
    if (!profile) return;

    const answer = Math.floor(Math.random() * 10) + 1;
    profile.time -= 3;
    await saveProfile(profile);

    const buttons = [];
    for (let i = 1; i <= 10; i++) {
        buttons.push(
            new ButtonBuilder()
                .setCustomId(`luckyduck_${answer}_${interaction.user.id}_${i}`)
                .setLabel(String(i))
                .setStyle(ButtonStyle.Primary)
        );
    }

    return interaction.editReply({
        content: `🦆 **Lucky Duck!** Pick a number 1–10.\n-# Time remaining: ${profile.time} min`,
        components: [
            new ActionRowBuilder().addComponents(buttons.slice(0, 5)),
            new ActionRowBuilder().addComponents(buttons.slice(5))
        ]
    });
}

async function handleSpinthewheel(interaction) {
    await interaction.deferReply();
    const profile = await requireTime(interaction, interaction.user.id, 3);
    if (!profile) return;

    const result = Math.floor(Math.random() * 10) + 1;
    profile.time -= 3;
    await saveProfile(profile);

    return interaction.editReply({
        content: `🎡 **Spin the Wheel!** You landed on: **message ${result}**\n-# Time remaining: ${profile.time} min`
    });
}

async function handleCointoss(interaction) {
    await interaction.deferReply({ flags: 64 });
    const profile = await requireTime(interaction, interaction.user.id, 3);
    if (!profile) return;

    const answer = Math.random() < 0.5 ? 'heads' : 'tails';
    profile.time -= 3;
    await saveProfile(profile);

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`cointoss_${answer}_${interaction.user.id}_heads`)
            .setLabel('Heads')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId(`cointoss_${answer}_${interaction.user.id}_tails`)
            .setLabel('Tails')
            .setStyle(ButtonStyle.Primary)
    );

    return interaction.editReply({
        content: `🪙 **Coin Toss!** Heads or Tails?\n-# Time remaining: ${profile.time} min`,
        components: [row]
    });
}

async function handleGameButton(interaction) {
    const [game, answer, ownerId, guess] = interaction.customId.split('_');

    if (interaction.user.id !== ownerId) {
        return interaction.reply({ content: '❌ This is not your game.', flags: MessageFlags.Ephemeral });
    }

    const disabledRows = interaction.message.components.map(row =>
        new ActionRowBuilder().addComponents(
            row.components.map(btn => ButtonBuilder.from(btn).setDisabled(true))
        )
    );

    const correct = guess === answer;

    await interaction.update({ content: interaction.message.content, components: disabledRows });

    if (game === 'luckyduck') {
        return interaction.followUp({
            content: correct
                ? `🦆 **Correct!** The number was **${answer}**! 🎉`
                : `🦆 **Wrong!** The number was **${answer}**. Better luck next time!`,
            flags: MessageFlags.Ephemeral
        });
    }

    if (game === 'cointoss') {
        return interaction.followUp({
            content: correct
                ? `🪙 **Correct!** It was **${answer}**! 🎉`
                : `🪙 **Wrong!** It was **${answer}**. Better luck next time!`,
            flags: MessageFlags.Ephemeral
        });
    }
}

module.exports = {
    handleRingtoss, handleDarts, handleClown, handleSunkDuck, handleCrane, handleHighstriker,
    handleLuckyduck, handleSpinthewheel, handleCointoss, handleGameButton
};

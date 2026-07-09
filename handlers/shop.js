const { MessageFlags, EmbedBuilder } = require('discord.js');
const { getStall, addToInventory } = require('../services/shop');
const { getProfile, saveProfile } = require('../services/profiles');

async function handleFood1(interaction) {
    await interaction.deferReply();
    const items = await getStall(1);
    if (items.length === 0) {
        return interaction.editReply({ content: '🎪 Stall 1 is currently empty.' });
    }
    const embed = new EmbedBuilder()
        .setTitle('🎪 Stall 1')
        .setColor(0xE63C3C)
        .setDescription(items.map(i => `**${i.item}** — *$${i.price}*\n`).join('\n'));
    return interaction.editReply({ embeds: [embed] });
}

async function handleFood2(interaction) {
    await interaction.deferReply();
    const items = await getStall(2);
    if (items.length === 0) {
        return interaction.editReply({ content: '🎪 Stall 2 is currently empty.' });
    }
    const embed = new EmbedBuilder()
        .setTitle('🎪 Stall 2')
        .setColor(0xE63C3C)
        .setDescription(items.map(i => `**${i.item}** — *$${i.price}*\n`).join('\n'));
    return interaction.editReply({ embeds: [embed] });
}

async function handleBuy(interaction) {
    await interaction.deferReply({ flags: 64 });
    const itemName = interaction.options.getString('item');
    const discordId = interaction.user.id;

    const [stall1, stall2] = await Promise.all([getStall(1), getStall(2)]);
    const found = [...stall1, ...stall2].find(i => i.item.toLowerCase() === itemName.toLowerCase());

    if (!found) {
        const embed = new EmbedBuilder()
                .setColor(0xE63C3C)
                .setDescription(`❌ **${itemName}** not found in any stall.`);

        return interaction.editReply({ embeds: [embed] });
    }

    const profile = await getProfile(discordId);
    if (!profile) {
        return interaction.editReply({ content: '❌ You don\'t have a profile set up yet.' });
    }
    if (profile.money < found.price) {
        const embed = new EmbedBuilder()
                .setTitle('🎭 Uh oh!')
                .setColor(0xE63C3C)
                .setDescription(`❌ Not enough money. \n**${found.item}** costs $${found.price} but you have $${profile.money}.`);

        return interaction.editReply({ embeds: [embed] });
    }

    profile.money -= found.price;
    await saveProfile(profile);
    await addToInventory(discordId, found.item, 1);

    const embed = new EmbedBuilder()
                .setTitle('🎭 Yay!')
                .setColor(0xE63C3C)
                .setDescription(`✅ You bought **${found.item}** for $${found.price}!\nRemaining balance: $${profile.money}`);

    return interaction.editReply({ embeds: [embed] });
}

module.exports = { handleFood1, handleFood2, handleBuy };

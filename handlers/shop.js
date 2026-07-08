const { MessageFlags, EmbedBuilder } = require('discord.js');
const { getStall, addToInventory } = require('../services/shop');
const { getProfile, saveProfile } = require('../services/profiles');

async function handleFood1(interaction) {
    await interaction.deferReply();
    const items = await getStall(1);
    if (items.length === 0) {
        return interaction.editReply({ content: '🏪 Stall 1 is currently empty.' });
    }
    const embed = new EmbedBuilder()
        .setTitle('🏪 Stall 1')
        .setDescription(items.map(i => `**${i.item}** — $${i.price}`).join('\n'));
    return interaction.editReply({ embeds: [embed] });
}

async function handleFood2(interaction) {
    await interaction.deferReply();
    const items = await getStall(2);
    if (items.length === 0) {
        return interaction.editReply({ content: '🏪 Stall 2 is currently empty.' });
    }
    const embed = new EmbedBuilder()
        .setTitle('🏪 Stall 2')
        .setDescription(items.map(i => `**${i.item}** — $${i.price}`).join('\n'));
    return interaction.editReply({ embeds: [embed] });
}

async function handleBuy(interaction) {
    await interaction.deferReply({ flags: 64 });
    const itemName = interaction.options.getString('item');
    const discordId = interaction.user.id;

    const [stall1, stall2] = await Promise.all([getStall(1), getStall(2)]);
    const found = [...stall1, ...stall2].find(i => i.item.toLowerCase() === itemName.toLowerCase());

    if (!found) {
        return interaction.editReply({ content: `❌ Item **${itemName}** not found in any stall.` });
    }

    const profile = await getProfile(discordId);
    if (!profile) {
        return interaction.editReply({ content: '❌ You don\'t have a profile set up yet.' });
    }
    if (profile.money < found.price) {
        return interaction.editReply({ content: `❌ Not enough money. **${found.item}** costs $${found.price} but you have $${profile.money}.` });
    }

    profile.money -= found.price;
    await saveProfile(profile);
    await addToInventory(discordId, found.item, 1);

    return interaction.editReply({ content: `✅ You bought **${found.item}** for $${found.price}. Remaining balance: $${profile.money}.` });
}

module.exports = { handleFood1, handleFood2, handleBuy };

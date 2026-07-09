const { MessageFlags, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { getProfile, saveProfile } = require('../services/profiles');

const TRAVEL_COST = {
    'north-south': 30, 'south-north': 30,
    'east-west': 30,   'west-east': 30
};

function getTravelCost(from, to) {
    return TRAVEL_COST[`${from}-${to}`] ?? 15;
}

async function handleAddMoney(interaction) {
    await interaction.deferReply();
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return interaction.editReply({ content: '❌ Administrator permission required.' });
    }
    const target = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');

    const profile = await getProfile(target.id);
    if (!profile) {
        return interaction.editReply({ content: `❌ ${target.username} doesn't have a profile.` });
    }

    profile.money += amount;
    await saveProfile(profile);

    return interaction.editReply({ content: `-# Added $${amount} to **${profile.name || target.username}**. New balance: $${profile.money}.` });
}

async function handleCheckTime(interaction) {
    await interaction.deferReply();
    const target = interaction.options.getUser('user');

    const profile = await getProfile(target.id);
    if (!profile) {
        return interaction.editReply({ content: `❌ ${target.username} doesn't have a profile.` });
    }

    return interaction.editReply({ content: `Time remaining: ${profile.time} min.` });
}

async function handleDeductTime(interaction) {
    await interaction.deferReply();
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return interaction.editReply({ content: '❌ Administrator permission required.' });
    }
    const target = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');

    const profile = await getProfile(target.id);
    if (!profile) {
        return interaction.editReply({ content: `❌ ${target.username} doesn't have a profile.` });
    }

    profile.time = Math.max(0, profile.time - amount);
    await saveProfile(profile);

    return interaction.editReply({ content: `-# Deducted ${amount} min from **${profile.name || target.username}**. Time remaining: ${profile.time} min.` });
}

async function handleTravel(interaction) {
    await interaction.deferReply();
    const destination = interaction.options.getString('area');
    const discordId = interaction.user.id;

    const profile = await getProfile(discordId);
    if (!profile) {
        return interaction.editReply({ content: '❌ You don\'t have a profile set up yet.' });
    }

    

    const origin = profile.location?.toLowerCase();
    if (origin === destination) {
        const embed = new EmbedBuilder()
                .setColor(0xE63C3C)
                .setDescription(`❌ You're already in **${destination}**.`);

        return interaction.editReply({ embeds: [embed] });
    }

    const cost = origin ? getTravelCost(origin, destination) : 0;

    if (cost > 0 && profile.time < cost) {
        const embed = new EmbedBuilder()
                .setColor(0xE63C3C)
                .setDescription(`❌ Not enough time to travel. Need **${cost} min** but you have **${profile.time} min**.`);

        return interaction.editReply({ embeds: [embed] });
    }

    profile.time = Math.max(0, profile.time - cost);
    profile.location = destination;
    await saveProfile(profile);

    return interaction.editReply({
        content: `-# **${profile.name || interaction.user.username}** traveled to **${destination}** (${cost} min deducted). Time remaining: ${profile.time} min.`
    });
}

module.exports = { handleAddMoney, handleDeductTime, handleTravel, handleCheckTime };

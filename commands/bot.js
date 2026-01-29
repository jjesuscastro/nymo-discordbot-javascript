const { SlashCommandBuilder } = require('discord.js');

const botCommands = new SlashCommandBuilder()
    .setName('nymo')
    .setDescription('Configure the Nymo Bot settings')
    .addSubcommand(sub =>
        sub.setName('setsecret')
            .setDescription('Assign a secret channel to a public channel')
            .addChannelOption(opt => opt.setName('secretchannel').setDescription('The secret channel').setRequired(true))
            .addChannelOption(opt => opt.setName('publicchannel').setDescription('The public channel').setRequired(true))
    )
    .addSubcommand(sub =>
        sub.setName('setalias')
            .setDescription('Assign an alias to a secret channel')
            .addChannelOption(opt => opt.setName('secretchannel').setDescription('The secret channel').setRequired(true))
    )
    .addSubcommand(sub =>
        sub.setName('log')
            .setDescription('Set the channel where real identities are logged')
            .addChannelOption(opt => opt.setName('channel').setDescription('The logging channel').setRequired(true))
    )
    .addSubcommand(sub =>
        sub.setName('message')
            .setDescription('Send an anonymous message from this channel. Use {{n}} to roll n D20s.')
    );

module.exports = botCommands.toJSON();

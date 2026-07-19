const { SlashCommandBuilder } = require('discord.js');

const commands = [
    // --- Nymo anonymous messaging ---
    new SlashCommandBuilder()
        .setName('setsecret')
        .setDescription('Assign a secret channel to a public channel')
        .addChannelOption(opt => opt.setName('secretchannel').setDescription('The secret channel').setRequired(true))
        .addChannelOption(opt => opt.setName('publicchannel').setDescription('The public channel').setRequired(true)),

    new SlashCommandBuilder()
        .setName('setalias')
        .setDescription('Assign an alias to a secret channel')
        .addChannelOption(opt => opt.setName('secretchannel').setDescription('The secret channel').setRequired(true)),

    new SlashCommandBuilder()
        .setName('log')
        .setDescription('Set the channel where real identities are logged')
        .addChannelOption(opt => opt.setName('channel').setDescription('The logging channel').setRequired(true)),

    new SlashCommandBuilder()
        .setName('message')
        .setDescription('Send an anonymous message from this channel'),

    // --- Minigames ---
    new SlashCommandBuilder()
        .setName('ringtoss')
        .setDescription('Toss some rings into the pegs! Highscorer gets the stamp.'),
        //.setDescription('Roll 20 D20s — score is count of rolls above 13. Costs 5 min.'),

    new SlashCommandBuilder()
        .setName('darts')
        .setDescription('Pop balloons! Highscorer gets the stamp.'),
        //.setDescription('Roll 10 D20s — score is count of rolls above 15. Costs 5 min.'),

    new SlashCommandBuilder()
        .setName('toothknockout')
        .setDescription('Knock out some teeth! Highscorer gets the stamp.'),

    new SlashCommandBuilder()
        .setName('sunkaduck')
        .setDescription('Knock a row of rubber duckies! Highscorer gets the stamp.'),

    new SlashCommandBuilder()
        .setName('crane')
        .setDescription('Win a prize from the claw machine! That\'s it.'),
        //.setDescription('Roll a D20 — hit exactly 13 to win a prize! Costs 1 min.'),

    new SlashCommandBuilder()
        .setName('buzzwire')
        .setDescription('Test your steady hands! Move a ring through the wires without making it touch.'),
        //.setDescription('Roll a D20 — hit exactly 13 to win a prize! Costs 1 min.'),

    new SlashCommandBuilder()
        .setName('highstriker')
        .setDescription('Strike down with a hammer and measure your strength! Highscorer gets the stamp.'),
        //.setDescription('Roll a D100 — that is your score. Costs 2 min.'),

    new SlashCommandBuilder()
        .setName('punchingbag')
        .setDescription('Punch as hard as you can! Highscorer gets the stamp.'),
        //.setDescription('Roll a D100 — that is your score. Costs 2 min.'),

    new SlashCommandBuilder()
        .setName('kickgame')
        .setDescription('Measure your kicks! Highscorer gets the stamp.'),
        //.setDescription('Roll a D100 — that is your score. Costs 2 min.'),

    new SlashCommandBuilder()
        .setName('excalibur')
        .setDescription('Pull the sword out of the stone!'),
        //.setDescription('Roll a D100 — that is your score. Costs 2 min.'),

    new SlashCommandBuilder()
        .setName('luckyduck')
        .setDescription('Pick the correct duck out of all these swimming duckies!'),
        //.setDescription('Pick the lucky number 1–10! Costs 3 min.'),

    new SlashCommandBuilder()
        .setName('spinthewheel')
        .setDescription('Test your fate. Spin the wheel.'),
        //.setDescription('Spin the wheel for a random result. Costs 3 min.'),

    new SlashCommandBuilder()
        .setName('cointoss')
        .setDescription('Heads or Tails?'),
        //.setDescription('Guess heads or tails! Costs 3 min.'),

    // --- Shop ---
    new SlashCommandBuilder()
        .setName('food1')
        .setDescription('View stall1\'s menu!'),

    new SlashCommandBuilder()
        .setName('food2')
        .setDescription('View stall2\'s menu!'),

    new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Buy an item from a stall')
        .addStringOption(opt => opt.setName('item').setDescription('Name of the item to buy').setRequired(true)),

    // --- Player management ---
    new SlashCommandBuilder()
        .setName('addmoney')
        .setDescription('(Admin) Add money to a player')
        .addUserOption(opt => opt.setName('user').setDescription('Target player').setRequired(true))
        .addIntegerOption(opt => opt.setName('amount').setDescription('Amount to add').setRequired(true).setMinValue(1)),

    new SlashCommandBuilder()
        .setName('checktime')
        .setDescription('Check a player\'s remaining time')
        .addUserOption(opt => opt.setName('user').setDescription('Target player').setRequired(true)),

    new SlashCommandBuilder()
        .setName('deducttime')
        .setDescription('(Admin) Deduct time from a player')
        .addUserOption(opt => opt.setName('user').setDescription('Target player').setRequired(true))
        .addIntegerOption(opt => opt.setName('amount').setDescription('Minutes to deduct').setRequired(true).setMinValue(1)),

    new SlashCommandBuilder()
        .setName('travel')
        .setDescription('Travel to an area')
        .addStringOption(opt =>
            opt.setName('area')
                .setDescription('Destination area')
                .setRequired(true)
                .addChoices(
                    { name: 'North', value: 'north' },
                    { name: 'South', value: 'south' },
                    { name: 'East', value: 'east' },
                    { name: 'West', value: 'west' },
                    { name: 'Center', value: 'center' }
                )
        ),
];

module.exports = commands.map(c => c.toJSON());

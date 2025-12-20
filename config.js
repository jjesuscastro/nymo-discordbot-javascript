const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    logChannel: { type: String, default: null },
    secretChannels: {
        type: Map,
        of: new mongoose.Schema({
            publicChannel: String,
            fakeName: String,
            webhookId: String,
            avatarUrl: String
        })
    }
});

const Config = mongoose.model('Config', configSchema);

async function getConfig(guildId) {
    let config = await Config.findOne({ guildId });
    if (!config) {
        config = new Config({ guildId, secretChannels: {} });
        await config.save();
    }
    return config;
}

module.exports = { Config, getConfig };

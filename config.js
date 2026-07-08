const { readSheet, writeSheet } = require('./services/sheets');

const GUILDS_SHEET = 'guilds';
const CHANNELS_SHEET = 'secretChannels';

// Headers
const GUILD_HEADERS = ['guildId', 'logChannel'];
const CHANNEL_HEADERS = ['guildId', 'channelId', 'publicChannel', 'fakeName', 'webhookId', 'avatarUrl'];

class GuildConfig {
    constructor(guildId, logChannel, channelRows) {
        this.guildId = guildId;
        this.logChannel = logChannel || null;

        // Internal map: channelId -> { publicChannel, fakeName, webhookId, avatarUrl }
        this._map = new Map();
        for (const row of channelRows) {
            const [, channelId, publicChannel, fakeName, webhookId, avatarUrl] = row;
            if (!channelId) continue;
            this._map.set(channelId, {
                publicChannel: publicChannel || null,
                fakeName: fakeName || null,
                webhookId: webhookId || null,
                avatarUrl: avatarUrl || null
            });
        }

        // Expose a Map-like object so existing handlers can call .get() / .set()
        this.secretChannels = {
            get: (key) => this._map.get(key),
            set: (key, value) => {
                this._map.set(key, value);
                return this.secretChannels;
            }
        };
    }

    async save() {
        // --- guilds sheet ---
        const guildRows = await readSheet(GUILDS_SHEET);
        const guildData = guildRows.slice(1).filter(r => r[0] && r[0] !== this.guildId);
        guildData.push([this.guildId, this.logChannel || '']);
        await writeSheet(GUILDS_SHEET, [GUILD_HEADERS, ...guildData]);

        // --- secretChannels sheet ---
        const channelRows = await readSheet(CHANNELS_SHEET);
        const otherRows = channelRows.slice(1).filter(r => r[0] && r[0] !== this.guildId);
        const myRows = [];
        for (const [channelId, d] of this._map.entries()) {
            myRows.push([
                this.guildId,
                channelId,
                d.publicChannel || '',
                d.fakeName || '',
                d.webhookId || '',
                d.avatarUrl || ''
            ]);
        }
        await writeSheet(CHANNELS_SHEET, [CHANNEL_HEADERS, ...otherRows, ...myRows]);
    }
}

async function getConfig(guildId) {
    const [guildRows, channelRows] = await Promise.all([
        readSheet(GUILDS_SHEET),
        readSheet(CHANNELS_SHEET)
    ]);

    const guildRow = guildRows.slice(1).find(r => r[0] === guildId) || [];
    const logChannel = guildRow[1] || null;

    const myChannelRows = channelRows.slice(1).filter(r => r[0] === guildId);

    return new GuildConfig(guildId, logChannel, myChannelRows);
}

module.exports = { getConfig };

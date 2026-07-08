const { readSheet, writeSheet } = require('./sheets');

const SHEET = 'profiles';
const HEADERS = ['DISCORD ID', 'NAME/ALIAS', 'PRONOUNS', 'TIME', 'MONEY', 'LOCATION', 'AVATAR LINK'];

function rowToProfile(row) {
    return {
        discordId: row[0] || '',
        name: row[1] || '',
        pronouns: row[2] || '',
        time: parseFloat(row[3]) || 0,
        money: parseFloat(row[4]) || 0,
        location: row[5] || '',
        avatar: row[6] || ''
    };
}

function profileToRow(p) {
    return [p.discordId, p.name, p.pronouns, String(p.time), String(p.money), p.location, p.avatar];
}

async function getProfile(discordId) {
    const rows = await readSheet(SHEET);
    const row = rows.slice(1).find(r => r[0] === discordId);
    if (!row) return null;
    return rowToProfile(row);
}

async function saveProfile(profile) {
    const rows = await readSheet(SHEET);
    const data = rows.slice(1).filter(r => r[0] && r[0] !== profile.discordId);
    data.push(profileToRow(profile));
    await writeSheet(SHEET, [HEADERS, ...data]);
}

module.exports = { getProfile, saveProfile };

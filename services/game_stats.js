const { readSheet, writeSheet } = require('./sheets');

const SHEET = 'Games';
const HEADERS = ['GAME', 'HIGHSCORE', 'PLAYER'];

async function getHighscore(game) {
    const rows = await readSheet(SHEET);
    const row = rows.slice(1).find(r => r[0] === game);
    return row ? (parseFloat(row[1]) || 0) : 0;
}

async function saveHighscore(game, discordId, score) {
    const rows = await readSheet(SHEET);
    const data = rows.slice(1).filter(r => r[0]);

    const idx = data.findIndex(r => r[0] === game && r[2] === discordId);
    if (idx >= 0) {
        data[idx][1] = String(score);
    } else {
        data.push([game, String(score), discordId]);
    }

    await writeSheet(SHEET, [HEADERS, ...data]);
}

module.exports = { getHighscore, saveHighscore };

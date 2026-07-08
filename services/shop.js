const { readSheet, writeSheet } = require('./sheets');

const INVENTORY_SHEET = 'inventory';
const INVENTORY_HEADERS = ['OWNER', 'ITEM', 'QUANTITY'];

async function getStall(number) {
    const rows = await readSheet(`stall${number}`);
    return rows.slice(1)
        .filter(r => r[0])
        .map(r => ({ item: r[0], price: parseFloat(r[1]) || 0 }));
}

async function getInventory(discordId) {
    const rows = await readSheet(INVENTORY_SHEET);
    return rows.slice(1)
        .filter(r => r[0] === discordId)
        .map(r => ({ item: r[1] || '', quantity: parseInt(r[2]) || 0 }));
}

async function addToInventory(discordId, item, qty = 1) {
    const rows = await readSheet(INVENTORY_SHEET);
    const data = rows.slice(1).filter(r => r[0]);

    const idx = data.findIndex(r => r[0] === discordId && r[1] === item);
    if (idx >= 0) {
        const current = parseInt(data[idx][2]) || 0;
        data[idx][2] = String(current + qty);
    } else {
        data.push([discordId, item, String(qty)]);
    }

    await writeSheet(INVENTORY_SHEET, [INVENTORY_HEADERS, ...data]);
}

module.exports = { getStall, getInventory, addToInventory };

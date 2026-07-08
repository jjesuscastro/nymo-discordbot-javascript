const { google } = require('googleapis');

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

function getAuth() {
    return new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
}

async function getSheetsClient() {
    const auth = getAuth();
    return google.sheets({ version: 'v4', auth });
}

async function readSheet(sheetName) {
    const sheets = await getSheetsClient();
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A:Z`
    });
    return res.data.values || [];
}

async function writeSheet(sheetName, values) {
    const sheets = await getSheetsClient();
    await sheets.spreadsheets.values.clear({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A:Z`
    });
    if (values.length === 0) return;
    await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A1`,
        valueInputOption: 'RAW',
        requestBody: { values }
    });
}

module.exports = { readSheet, writeSheet };

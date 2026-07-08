# Game Master Discord Bot

## Features
- Send anonymous messages through an alias
- Carnival minigames with time-based economy
- Shop system with two stalls and inventory tracking
- Player profile management (time, money, location)
- All player data stored in Google Sheets

---

## Commands

### Anonymous Messaging

| Command | Options | Description |
|---|---|---|
| `/setsecret` | `#secret-channel` `#public-channel` | Links a secret channel to a public channel. Messages sent from the secret channel appear in the public channel under an alias. Admin only. |
| `/setalias` | `#secret-channel` | Opens a form to set the alias name and avatar image for a secret channel. Admin only. |
| `/log` | `#channel` | Sets the channel where real user identities are logged for moderation. Admin only. |
| `/message` | *(none)* | Opens a message form in a secret channel. Sends your message to the linked public channel under the configured alias. Supports dice rolls with `{{NdN}}` syntax (e.g. `{{2d6+3}}`). |

---

### Minigames

All games require a player profile and deduct time on use. Results are compared against your personal highscore.

| Command | Time Cost | Description |
|---|---|---|
| `/ringtoss` | 5 min | Rolls 20 D20s. Score = number of rolls above 13. |
| `/darts` | 5 min | Rolls 10 D20s. Score = number of rolls above 15. |
| `/crane` | 1 min | Rolls 1 D20. Roll exactly 13 to win the first item in Stall 1, added to your inventory. |
| `/highstriker` | 2 min | Rolls 1 D100. That number is your score. |
| `/luckyduck` | 3 min | Bot picks a hidden number 1–10. Click the matching button to win. |
| `/spinthewheel` | 3 min | Bot picks a random result 1–10 and announces it. |
| `/cointoss` | 3 min | Bot flips a hidden coin. Click Heads or Tails to guess. |

---

### Shop

| Command | Options | Description |
|---|---|---|
| `/food1` | *(none)* | Displays all items and prices in Stall 1. |
| `/food2` | *(none)* | Displays all items and prices in Stall 2. |
| `/buy` | `item` | Buys an item by name from either stall. Deducts the price from your money and adds the item to your inventory. |

---

### Player Management

| Command | Options | Description |
|---|---|---|
| `/addmoney` | `@user` `amount` | Adds the specified amount of money to a player's profile. Admin only. |
| `/deducttime` | `@user` `amount` | Deducts the specified number of minutes from a player's time. Admin only. |
| `/travel` | `area` | Travel to `north`, `south`, `east`, `west`, or `center`. Adjacent areas cost 15 min; opposite areas (north↔south, east↔west) cost 30 min. |

---

## Google Sheets Structure

All data is stored in a single Google Spreadsheet with these tabs:

| Tab | Columns |
|---|---|
| `guilds` | Guild ID, Log Channel |
| `secretChannels` | Guild ID, Channel ID, Public Channel, Fake Name, Webhook ID, Avatar URL |
| `profiles` | Discord ID, Name/Alias, Pronouns, Time (min), Money, Location, Avatar Link |
| `inventory` | Owner (Discord ID), Item, Quantity |
| `stall1` | Item, Price |
| `stall2` | Item, Price |
| `game` | Game, Highscore, Player (Discord ID) |

---

## Setup

1. Create a Google Cloud service account and share the spreadsheet with its email (Editor access).
2. Add the following to your `.env`:
   ```
   DISCORD_TOKEN=...
   CLIENT_ID=...
   SPREADSHEET_ID=...
   GOOGLE_SERVICE_ACCOUNT_EMAIL=...
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```
3. Run `node index.js`.

---

## Links
- [Terms of Service](https://gist.github.com/jjesuscastro/9cbd0044cb5c47b83ba953f6f7bd4985)
- [Privacy Policy](https://gist.github.com/jjesuscastro/52dcbd8cb6af93c0732ee08084f0d8fe)

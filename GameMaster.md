# Game Master (formerly Nymo)

## Old Commands
1. /setSecret <secretChannel> <publicChannel>
    - Set Secret channel per user where they will send messages using their actual discord display names which will then send a message with their alias to a specified `publicChannel`
2. /log <logChannel>
    - Sets a channel as the `logChannel` where the bot will post the real identity behind every anonymous message - who sent it, what alias they used, and what channel it was sent to.
3. /message <message>
    - Can only be used inside the `secretChannel` assigned to the Discord ID sending the command.
    - Will send the `message` to the specified `publicChannel` using the anonymous alias.
4. /setAlias <secretChannel>
    - Sets an alias tied to a `secretChannel` that gets Alias name and avatar image URL.

### Note
- We will only use /log command moving forward, but don't remove the other old commands for ~memories~

## New Commands
1. /ringtoss
    - 5 minute deduction
    - Rolls 20 D20 dieces, for every number over 13, that's the score
2. /darts
    - 5 minute deduction
    - Rolls 10 D20 dices, for every number over 15, that's the score
3. /crane
    - 1 minute deduction
    - Need to get exactly 13 from a D20
    - Winning gets a specified item, for now use the first item in Stall 1
4. /highstriker
    - 2 minute deduction
    - Roll 1 D100 dice, that is the score
5. /luckyduck
    - 3 minute deduction
    - Without displaying, get a random number from 1-10 (inclusive)
    - Player will then need to input their guess
    - Keep track of number of correct guesses
6. /spinthewheel
    - 3 minute deduction
    - Randomize a message to send by the bot
    - Messages will be provided later but for now use "message 1-10" depending on result
7. /cointoss
    - 3 minute deduction
    - Randomize between heads and tails, without displaying
    - Player needs to guess either heads or tails
8. /addmoney <@discord user> <amount>
    - Adds money to mentioned discord user
9. /food1
    - Displays items in Shop 1
10. /food2
    - Displays items in Shop 2
11. /deducttime <@discord ser> <amount>
    - Deducts specified time from the mentioned discord user
12. /travel <area>
    - Travel to a specified area (north, south, east, west, center)
    - Deduct based on origin and destination
        - Adjacent (north - east/west or any direction to/from center) deduct 15 minutes
        - If south - north, east - west, deduct 30 minutes
13. /buy <item>
    - Buys an item from either Shop 1 or Shop 2 depending on item
    - Deducts Price from Money

## Gsheet Format

Each section is a separate sheet in the same file

### Profiles
A: DISCORD ID
B: NAME/ALIAS
C: PRONOUNS
D: TIME
E: MONEY
F: LOCATION
G: AVATAR LINK

### Inventory
- Keeps track of bought items from Stall 1 and Stall 2
A: OWNER (DISCORD ID)
B: ITEM
C: QUANTITY

### Stall1
- Essentially a shop
A: ITEM
B: PRICE

### Stall2
- Essentially a shop
A: ITEM
B: PRICE

### Games
- Keeps track of game results from `New Commands` section
A: GAME
B: HIGHSCORE
C: PLAYER (DISCORD ID)
<div align="center">
	<br />
	<p>
		<img src="./src/Banner.png" alt="Yet 2.0 banner img" />
	</p>
</div>

<h1 align="center"> The official discord.js remake of Yet 2.0! (previously aoi.js)</h1>

<br>

## *Currently still adding the rest of the commands from the aoi.js to discord.js move.*
<br>

# Commands
## Misc
_**/help**_ - `View current commands and soon extra infomaion`

_**/ping**_ - `Websocket heartbeat and API roundabout`
## Global Economy

_**/work**_ - `Work as a {job} to earn coins.`

_**/daily**_ - 	`Claim your 1000 coins everyday`

_**/balance**_ - `View your, or another user's balance.`

_**/inventory**_ - `View all the items you have, and your shield status`

_**/shop**_ _**/buy**_ - `View the shop to buy items`

_**/withdraw**_ _**/deposit**_ - `Withdraw or deposit coins into your bank`

_**/rob**_ - `Rob a user, can either end in a lot of money or a lot of debt`

_**/share**_ - `Share your wealth (or items) with other users. (Has a confirmation message and cannot share shield)`

_**/leaderboard**_ - `See who is currently at the top of the global coinss leaderboard!`

# Contributions

I probably will not allow contributions to be made, this is a one man bot and it will stay that way. But suggestions to code fixes and improvements are helpful, and cannot be left unnoticed (Your name will be in the README.md)

# Cloning

`git cloe https://github.com/Yetity/y2b`

## Pre-files

Files that i do not push i reccommend you do not either (if your bot will have an open repository)

`node_modules`

`.env`

`promocodes.json` (just to hide the promocodes)

## Database
### Connecting
If you haven't noticed, I use MongoDB.

After the sign up process and DB creation, go to `.env` and add
```
MONGODB_URI = your_mongodb_connection_uri
```
### Models
Models are already defined so don't worry about that :+1:
(Of course you can change it to your liking)
## Emojis
In `src/utils/beatify.js` is where you can find and edit the coin emoji and

In `src/utils/items/items.json` is where you can edit every individual emoji per item.
## Post-files
Assuming you actually cloned this and saw how rigged my code is, 

Best of luck! - Yet#0447
// when it takes time to load somethig, show this to the user
const { EmbedBuilder } = require("discord.js");

const gifs = [
    "https://tenor.com/bVgGo.gif",
    "https://tenor.com/blPzf.gif",
    "https://tenor.com/bVcyY.gif",
    "https://tenor.com/bsivx.gif",
];

function preLoad() {
    const num = Math.floor(Math.random() * gifs.length);
    const embed = new EmbedBuilder()
        .setDescription("While you wait...")
        .setImage(gifs[num]);

    return embed;
}

module.exports = { preLoad };

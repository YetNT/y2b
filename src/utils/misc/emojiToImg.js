const getUnicode = require("emoji-unicode");
const Emojis = require("emoji-name-map");

function extractEmojiName(input) {
    // Match both <:name:id> and :name: formats
    const match = input.match(/<(?::|a)?(\w+):|:(\w+):/);

    if (match) {
        return match[1] || match[2];
    } else {
        return null; // No valid emoji format found
    }
}

module.exports = async (client, input) => {
    const inputName = extractEmojiName(input);

    console.log(inputName);

    if (!inputName) {
        throw new Error("Invalid emoji input format.");
    }

    const baseUrl = "https://cdn.discordapp.com/emojis/";

    const emoji = await client.emojis.cache.find((e) => e.name === inputName);

    if (!emoji) {
        let discordEmoji = Emojis.get(`:${inputName}:`);
        let emojiUnicode = getUnicode(discordEmoji);
        return `https://twitter.github.io/twemoji/v/13.1.0/72x72/${emojiUnicode}.png`;
    }

    return `${baseUrl}${emoji.id}.${emoji.animated ? "gif" : "png"}`;
};

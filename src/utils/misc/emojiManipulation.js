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

const emojiToImage = async (client, input) => {
    const inputName = extractEmojiName(input);

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

const emojiToUnicode = (input) => {
    let inputName;

    if (input.includes("<")) {
        return input;
    } else {
        inputName = extractEmojiName(input);

        if (!inputName) {
            throw new Error("Invalid emoji input format.");
        }
    }

    let discordEmoji = Emojis.get(`:${inputName}:`);
    let emojiUnicode;
    try {
        emojiUnicode = getUnicode(discordEmoji);
    } catch (err) {
        throw new TypeError("Not a valid emoji unicode!");
    }

    return String.fromCodePoint(parseInt(emojiUnicode, 16));
};

module.exports = { emojiToImage, emojiToUnicode };

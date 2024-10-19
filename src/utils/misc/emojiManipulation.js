const getUnicode = require("emoji-unicode");
const Emojis = require("emoji-name-map");
const { Client } = require("discord.js");

function extractEmojiName(input) {
    // Match both <:name:id> and :name: formats
    const match = input.match(/<(?::|a)?(\w+):(\d+)>|:(\w+):/);

    if (match) {
        return match[1] || match[3]; // Return either name from the first or third capturing group
    } else {
        return null; // No valid emoji format found
    }
}

/**
 * turns discord input like :gem: or <:gem:2345> to an image form discord cdn or twitter emoji if its not discord native.
 * @param {Client} client
 * @param {string} input
 * @returns
 */
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

/**
 * Converts a stirng like :gem: to it's unicode emoji. But if its a discord native emoji with the <> (example <:gem:123231>) then it just returns it as discord does all the rendering.
 * This is mostly for buttons with emojis where the input for the emoji only works with unicode stuff.
 * @param {string} input
 * @returns
 */
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

module.exports = { emojiToImage, emojiToUnicode, extractEmojiName };

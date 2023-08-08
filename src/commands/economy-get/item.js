const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const Items = require("../../utils/misc/items/items");
const { itemNames } = require("../../utils/misc/items/getItems");
const { coin } = require("../../utils/formatters/beatify");
const errorHandler = require("../../utils/handlers/errorHandler");
const { emojiToImage } = require("../../utils/misc/emojiManipulation");

module.exports = {
    name: "item",
    description: "View an item's information.",
    blacklist: true,
    options: [
        {
            name: "item",
            description: "Which item you buying?",
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: itemNames(),
        },
    ],

    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        await interaction.deferReply();
        try {
            const itemName = interaction.options.get("item").value;
            const item = Items[itemName];

            const image =
                item.emoji !== undefined
                    ? await emojiToImage(client, item.emoji)
                    : null;

            let fields = [
                {
                    name: "Info",
                    value: item.description,
                    inline: true,
                },
                {
                    name: "Uses",
                    value:
                        item.uses.length > 0
                            ? item.uses.join("\n")
                            : "This item has no uses.",
                    inline: true,
                },
            ];
            if (item.price !== -1) {
                fields.push({
                    name: "Price",
                    value: coin(item.price),
                    inline: true,
                });
            }
            fields.push({
                name: "ID",
                value: `\`${item.id}\``,
                inline: true,
            });

            let embed = new EmbedBuilder()
                .setTitle(item.name)
                .setFields(fields)
                .setFooter({ text: `Rarity: ${item.rarity}` });

            if (item.emoji) {
                embed.setThumbnail(image);
            }
            await interaction.editReply({
                embeds: [embed],
            });
        } catch (error) {
            errorHandler(error, client, interaction, EmbedBuilder);
        }
    },
};

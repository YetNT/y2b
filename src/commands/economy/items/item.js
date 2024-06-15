const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const Items = require("../../../utils/misc/items/items");
const {
    itemNames,
    getRecipeItems,
} = require("../../../utils/misc/items/getItems");
const { coin } = require("../../../utils/formatters/beatify");
const errorHandler = require("../../../utils/handlers/errorHandler");
const { emojiToImage } = require("../../../utils/misc/emojiManipulation");
const { SlashCommandManager } = require("ic4d");

const items = itemNames();

const item = new SlashCommandManager({
    data: new SlashCommandBuilder()
        .setName("item")
        .setDescription("View an item's information.")
        .addStringOption((option) =>
            option
                .setName("item")
                .setDescription("Which item you tryna view cuh?")
                .setRequired(true)
                .setChoices(...items)
        ),
    async execute(interaction, client) {
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
            if (item.sell !== -1) {
                fields.push({
                    name: "Sell Price",
                    value: coin(item.sell),
                    inline: true,
                });
            }
            if (item.craftingRecipe !== undefined) {
                fields.push({
                    name: "Forge Recipe",
                    value: getRecipeItems(item.craftingRecipe),
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
});

item.blacklist = true;
item.category = "economy";

module.exports = item;

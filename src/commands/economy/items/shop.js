const {
    EmbedBuilder,
    ComponentType,
    ButtonStyle,
    SlashCommandBuilder,
} = require("discord.js");
const items = require("../../../utils/misc/items/items");
const { shopify } = require("../../../utils/formatters/beatify");
const errorHandler = require("../../../utils/handlers/errorHandler");
const { SlashCommandManager } = require("ic4d");
const { Pager } = require("@fyleto/dpager");

const shop = new SlashCommandManager({
    data: new SlashCommandBuilder()
        .setName("shop")
        .setDescription("Shop for items that are definitely not overpriced"),
    async execute(interaction, client) {
        await interaction.deferReply();
        const pages = new Pager();
        try {
            let reply = [];

            for (let item in items) {
                if (items[item].price === -1) continue;
                let emoji =
                    items[item].emoji !== undefined ? items[item].emoji : "";
                reply.push(
                    `${emoji} __${items[item].name}__ - ${shopify(
                        items[item].price
                    )}\n${items[item].description}`
                );
            }

            pages.addDynamicPages(reply, 5, "\n\n");

            pages.config({
                nextPage: {
                    label: "Next Page",
                    style: ButtonStyle.Secondary,
                },
                prevPage: {
                    label: "Previous Page",
                    style: ButtonStyle.Secondary,
                },
            });
            let page = await pages.currentPage();
            let embed = new EmbedBuilder().setTitle("Shop").setColor("Fuchsia");

            const response = await interaction.editReply({
                embeds: [
                    embed.setDescription(page.raw.content).setFooter({
                        text: `Page ${pages.index + 1}/${pages.pages.length}`,
                    }),
                ],
                components: page.components,
            });

            const collector = response.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 3_600_000,
            });

            collector.on("collect", async (i) => {
                let page = await pages.currentPage(i.customId);
                await i.update({
                    embeds: [
                        embed.setDescription(page.raw.content).setFooter({
                            text: `Page ${pages.index + 1}/${
                                pages.pages.length
                            }`,
                        }),
                    ],
                    components: page.components,
                });
            });
        } catch (error) {
            errorHandler(error, client, interaction, EmbedBuilder);
        }
    },
});

shop.category = "economy";
shop.blacklist = true;

module.exports = shop;

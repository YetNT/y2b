const {
    EmbedBuilder,
    ComponentType,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");
const items = require("../../utils/misc/items/items");
const { shopify } = require("../../utils/formatters/beatify");
const errorHandler = require("../../utils/handlers/errorHandler");
const { pageCreator, pagerButtons } = require("../../utils/handlers/pages");

module.exports = {
    name: "shop",
    description: "Shop for items that are definitely not overpriced",
    blacklist: true,

    callback: async (client, interaction) => {
        await interaction.deferReply();
        try {
            let nextPage = new ButtonBuilder()
                .setCustomId("nextPage")
                .setLabel("Next Page")
                .setStyle(ButtonStyle.Secondary);
            let previousPage = new ButtonBuilder()
                .setCustomId("prevPage")
                .setLabel("Previous Page")
                .setStyle(ButtonStyle.Secondary);
            let reply = [];

            for (let item in items) {
                if (items[item].price === -1) continue;
                reply.push(
                    `__${items[item].name}__ - ${shopify(items[item].price)}\n${
                        items[item].description
                    }`
                );
            }

            let pageItems = pageCreator(reply, 5);
            let embed = new EmbedBuilder().setTitle("Shop").setColor("Fuchsia");
            let initRow =
                pageItems.length != 1
                    ? [pagerButtons(nextPage, previousPage, "previous")]
                    : [];

            var pageIndex = 1;
            const response = await interaction.editReply({
                embeds: [
                    embed
                        .setDescription(pageItems[pageIndex - 1].join("\n\n"))
                        .setFooter({
                            text: `Page ${pageIndex}/${pageItems.length}`,
                        }),
                ],
                components: initRow,
            });

            const collector = response.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 3_600_000,
            });

            collector.on("collect", async (i) => {
                let id = i.customId;
                let pagerRow;

                if (id == "prevPage") {
                    pageIndex--;
                    if (pageIndex != 1) {
                        pagerRow = pagerButtons(nextPage, previousPage, null);
                    } else {
                        pagerRow = pagerButtons(
                            nextPage,
                            previousPage,
                            "previous"
                        );
                    }
                }
                if (id == "nextPage") {
                    pageIndex++;
                    if (pageIndex != pageItems.length) {
                        pagerRow = pagerButtons(nextPage, previousPage, null);
                    } else {
                        pagerRow = pagerButtons(nextPage, previousPage, "next");
                    }
                }
                await i.update({
                    embeds: [
                        embed
                            .setDescription(
                                pageItems[pageIndex - 1].join("\n\n")
                            )
                            .setFooter({
                                text: `Page ${pageIndex}/${pageItems.length}`,
                            }),
                    ],
                    components: [pagerRow],
                });
            });
        } catch (error) {
            errorHandler(error, client, interaction, EmbedBuilder);
        }
    },
};

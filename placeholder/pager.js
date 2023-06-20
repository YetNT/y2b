const {
    EmbedBuilder,
    ComponentType,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");

const { pageCreator, pagerButtons } = require("../src/utils/handlers/pages");

module.exports = {
    name: "testicles",
    description: "Ayo",
    deleted: true,

    callback: async (client, interaction) => {
        try {
            await interaction.deferReply();
            let nextPage = new ButtonBuilder()
                .setCustomId("nextPage")
                .setLabel("Next Page")
                .setStyle(ButtonStyle.Secondary);
            let previousPage = new ButtonBuilder()
                .setCustomId("prevPage")
                .setLabel("Previous Page")
                .setStyle(ButtonStyle.Secondary);

            let items = [
                "Item1",
                "Item2",
                "Item3",
                "Item4",
                "Item5",
                "Item6",
                "Item7",
                "Item8",
                "Item9",
                "Item10",
                "Item11",
            ];
            let pageItems = pageCreator(items, 5);

            let initRow =
                pageItems.length != 1
                    ? [pagerButtons(nextPage, previousPage, "previous")]
                    : [];

            var pageIndex = 1;
            const response = await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(pageItems[pageIndex - 1].join("\n"))
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
                        new EmbedBuilder()
                            .setDescription(pageItems[pageIndex - 1].join("\n"))
                            .setFooter({
                                text: `Page ${pageIndex}/${pageItems.length}`,
                            }),
                    ],
                    components: [pagerRow],
                });
            });
        } catch (error) {
            console.log(error);
        }
    },
};

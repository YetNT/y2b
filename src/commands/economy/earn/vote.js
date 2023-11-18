const errorHandler = require("../../../utils/handlers/errorHandler");
const { coin } = require("../../../utils/formatters/beatify");
const {
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
} = require("discord.js");

const { SlashCommandObject } = require("ic4d");
const links = {
    dbl: "https://discordbotlist.com/bots/yet-20/upvote",
    top: "https://top.gg/bot/701280304182067251/vote",
};

let amt = 10_000;

const vote = new SlashCommandObject({
    name: "vote",
    description: "Vote for the bot on top.gg and discordbotlist",

    callback: async (client, interaction) => {
        await interaction.deferReply();

        try {
            const top = new ButtonBuilder()
                .setLabel("Top.gg")
                .setStyle(ButtonStyle.Link)
                .setURL(links.top);
            const dbl = new ButtonBuilder()
                .setLabel("Discordbotlist")
                .setStyle(ButtonStyle.Link)
                .setURL(links.dbl);

            const row = new ActionRowBuilder().addComponents(top, dbl);
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Vote for the bot!")
                        .setDescription(
                            `Thanks for supporting the bot :)\nIn return you'll receive ${coin(
                                amt
                            )}\n\nWait for at least **10mins** before reporting that you didn't receive your rewards.`
                        ),
                ],
                components: [row],
            });
        } catch (error) {
            errorHandler(error, client, interaction, EmbedBuilder);
        }
    },
});

vote.category = "economy";
vote.blacklist = true;

module.exports = vote;

const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const errorHandler = require("../../../../utils/handlers/errorHandler");
const { SlashCommandObject } = require("ic4d");
const { EmbedError } = require("../../../../utils/handlers/embedError");
const { balance } = require("./func");

const bal = new SlashCommandObject({
    name: "balance",
    description: "View your or another user's coin balance, bank and networth",
    blacklist: true,
    options: [
        {
            name: "user",
            description:
                "view another user's balance (leave blank to view yours)",
            type: ApplicationCommandOptionType.User,
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
            let option = interaction.options.get("user")?.value;
            let u;
            if (option) {
                u = await client.users.fetch(option);
                if (u.bot)
                    return interaction.editReply(
                        new EmbedError("Bots are broke.").output
                    );
            }
            let querySet;

            if (option) {
                // set the user id to the option field
                querySet = option;
            } else {
                // set the user id to the user's id
                querySet = interaction.user.id;
            }

            const query = {
                userId: querySet,
            };

            await balance(interaction, query, option, u);

            //
        } catch (error) {
            errorHandler(error, client, interaction, EmbedBuilder);
        }
    },
});

bal.category = "economy";
bal.blacklist = true;

module.exports = bal;

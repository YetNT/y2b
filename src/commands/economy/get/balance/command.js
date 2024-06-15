const {
    EmbedBuilder,
    SlashCommandBuilder,
} = require("discord.js");
const errorHandler = require("../../../../utils/handlers/errorHandler");
const { SlashCommandManager } = require("ic4d");
const { EmbedError } = require("../../../../utils/handlers/embedError");
const { balance } = require("./func");

const bal = new SlashCommandManager({
    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription(
            "View your or another user's coin balance, bank and networth"
        )
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription(
                    "view another user's balance (leave blank to view yours)"
                )
        ),
    async execute(interaction, client) {
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

const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const errorHandler = require("../../../../utils/handlers/errorHandler");
const { SlashCommandObject } = require("ic4d");
const { EmbedError } = require("../../../../utils/handlers/embedError");
const { inventory } = require("./func");

const inv = new SlashCommandObject({
    name: "inventory",
    description: "View your or another user's inventory",
    blacklist: true,
    options: [
        {
            name: "user",
            description: "Select which user's inventory you'd like to see",
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
            let query;
            let user = interaction.options.get("user")?.value;
            if (user) {
                user = await client.users.fetch(user); // this makes the variable even tho code didnt run lol
                if (user.bot)
                    return interaction.editReply(
                        new EmbedError("A beep boop cant have an inventory")
                            .output
                    );
            }
            let userInfo;
            if (user) {
                query = {
                    userId: user.id,
                };
                userInfo = user;
            } else {
                query = {
                    userId: interaction.user.id,
                };
                userInfo = interaction.user;
            }

            await inventory(interaction, query, userInfo);
        } catch (error) {
            errorHandler(error, client, interaction, EmbedBuilder);
        }
    },
});
inv.category = "economy";
inv.blacklist = true;

module.exports = inv;

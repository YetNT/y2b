// ONLY AVAILABLE ON BETA BOT!!!!!!!
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const User = require("../../models/User");
const errorHandler = require("../../utils/handlers/errorHandler");
const { SlashCommandManager } = require("ic4d");

const blacklist = new SlashCommandManager({
    data: new SlashCommandBuilder()
        .setName("blacklist")
        .setDescription("blacklist users.")
        .addStringOption((option) =>
            option
                .setName("query")
                .setDescription("add or remove")
                .addChoices(
                    {
                        name: "add",
                        value: "add",
                    },
                    {
                        name: "remove",
                        value: "remove",
                    }
                )
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("user")
                .setDescription(
                    "User id of the user you would like to blacklist. This is parsed as a string cuz discord gae"
                )
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("why blacklist?")
                .setRequired(true)
        ),

    async execute(interaction, client) {
        try {
            await interaction.deferReply({ ephemeral: true });

            const code = interaction.options.get("query").value;
            const victim = interaction.options.get("user").value;
            const reason = interaction.options.get("reason").value;

            let victimUser = await client.users.fetch(victim);

            const time = Date.now();
            const query = {
                userId: victim,
            };

            let user = await User.findOne(query);
            let blacklist = user.blacklist;

            if (code === "add") {
                if (blacklist) {
                    if (blacklist.ed == true) {
                        interaction.editReply({
                            content: "This user has already been blacklisted",
                            ephemeral: true,
                        });
                        return;
                    }
                    blacklist.ed = true;
                    blacklist.reason = reason;
                    blacklist.time = time;
                } else {
                    blacklist = {
                        ed: true,
                        reason: reason,
                        time: time,
                    };
                }
            } else {
                if (blacklist) {
                    if (blacklist.ed == false) {
                        interaction.editReply({
                            content:
                                "This user is already removed from the blacklist.",
                            ephemeral: true,
                        });
                        return;
                    }
                    blacklist.ed = false;
                    blacklist.reason = reason;
                    blacklist.time = time;
                } else {
                    blacklist = {
                        ed: false,
                        reason: reason,
                        time: time,
                    };
                }
            }

            await User.save(user);

            if (code === "add") {
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("User")
                            .setDescription(
                                `The user <@${victim}> has been add to the blacklist`
                            )
                            .setFields({
                                name: "Reason",
                                value: `${reason}`,
                            })
                            .setColor("Red"),
                    ],
                    ephemeral: true,
                });

                // log to support server

                client.guilds.cache
                    .get("808701451399725116")
                    .channels.cache.get("858644165038047262")
                    .send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("New User")
                                .setFields([
                                    {
                                        name: "User",
                                        value:
                                            `Name: **${victimUser.username}** \n` +
                                            `Discrim: **${victimUser.discriminator}** \n` +
                                            `User Id: **${victim}**`,
                                        inline: true,
                                    },
                                    {
                                        name: "Reason",
                                        value: `${reason}`,
                                        inline: true,
                                    },
                                    {
                                        name: "Time (epoch)",
                                        value: `${time}`,
                                        inline: true,
                                    },
                                ])
                                .setThumbnail(victimUser.avatarURL())
                                .setColor("Red")
                                .setImage(
                                    "https://cdn.discordapp.com/emojis/860970578684018700.webp?size=160&quality=lossless"
                                ),
                        ],
                    });
            } else {
                interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("User")
                            .setDescription(
                                `The user <@${victim}> has been removed from the blacklist`
                            )
                            .setColor("Red"),
                    ],
                    ephemeral: true,
                });

                // log to support server

                client.guilds.cache
                    .get("808701451399725116")
                    .channels.cache.get("858644165038047262")
                    .send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("New User Removal")
                                .setFields(
                                    {
                                        name: "User",
                                        value:
                                            `Name: **${victimUser.username}** \n` +
                                            `Discrim: **${victimUser.discriminator}** \n` +
                                            `User Id: **${victim}**`,
                                        inline: true,
                                    },
                                    {
                                        name: "Time (epoch)",
                                        value: `${time}`,
                                        inline: true,
                                    }
                                )
                                .setColor("Green")
                                .setThumbnail(victimUser.avatarURL())
                                .setImage(
                                    "https://cdn.discordapp.com/emojis/860970578747981864.webp?size=160&quality=lossless"
                                ),
                        ],
                    });
            }
        } catch (error) {
            errorHandler(error, client, interaction, EmbedBuilder);
        }
    },
}).setDev(true);

blacklist.devOnly = true;
blacklist.category = "dev";

module.exports = blacklist;

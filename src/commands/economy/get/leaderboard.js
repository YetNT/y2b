const { EmbedBuilder } = require("discord.js");
const User = require("../../../models/User");
const { coin } = require("../../../utils/formatters/beatify");
const errorHandler = require("../../../utils/handlers/errorHandler");
const { SlashCommandObject } = require("ic4d");

const lb = new SlashCommandObject({
    name: "leaderboard",
    description: "View the coins leaderboard and a random leaderboard",
    blacklist: true,

    callback: async (client, interaction) => {
        await interaction.deferReply();
        try {
            const server = await client.guilds.cache.get(interaction.guild.id);
            const leaderboard = await User.find((doc) => {
                return doc.hasOwnProperty("balance") === true;
            });
				leaderboard.sort((a, b) => a.balance - b.balance)
				console.log(leaderboard)

            let serverLeaderboard = [];
            /* const sL = await User.find(
                (doc) => {return doc.hasOwnProperty("balance") === true}
            )
				sL.sort((a, b) => a.balance - b.balance)
            //    .select("userId balance -_id"); */
            for (let user of leaderboard) {
                let isMember = await server.members
                    .fetch(user.userId)
                    .then(() => true)
                    .catch(() => false);
                if (isMember == true) {
                    serverLeaderboard.push(user);
                }
            }

            let usernames = { lb: [], item: [], slb: [] };

            let globalLb = [];
            let globalPos = 0;
            for (let i = 0; i < 5; i++) {
                let cachedUser = await client.users
                    .fetch(leaderboard[i].userId)
                    .catch(() => null);
                usernames.lb.push(cachedUser);
                let position =
                    i == 0
                        ? ":first_place:"
                        : i == 1
                        ? ":second_place:"
                        : i == 2
                        ? ":third_place:"
                        : `${i + 1}.`;
                globalLb.push(
                    `${position} ${usernames.lb[i].username} - ${coin(
                        leaderboard[i].balance
                    )}`
                );
                if (leaderboard[i].userId == interaction.user.id) {
                    globalPos = i + 1;
                }
            }

            let serverLb = [];
            let serverPos = 0;
            for (let i = 0; i < 5; i++) {
                let cachedUser = await client.users
                    .fetch(serverLeaderboard[i].userId)
                    .catch(() => null);
                usernames.slb.push(cachedUser);
                let position =
                    i == 0
                        ? ":first_place:"
                        : i == 1
                        ? ":second_place:"
                        : i == 2
                        ? ":third_place:"
                        : `${i + 1}.`;
                serverLb.push(
                    `${position} ${usernames.slb[i].username} - ${coin(
                        serverLeaderboard[i].balance
                    )}`
                );
                if (serverLeaderboard[i].userId == interaction.user.id) {
                    serverPos = i + 1;
                }
            }

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Leaderboard")
                        .setColor("Yellow")
                        .setFields([
                            {
                                name: "Global",
                                value: globalLb.join("\n"),
                                inline: true,
                            },
                            {
                                name: "Server",
                                value: serverLb.join("\n"),
                                inline: true,
                            },
                        ])
                        .setFooter({
                            text: `Server Position: #${serverPos} | Global Position: #${globalPos}`,
                        }),
                ],
            });
        } catch (error) {
            errorHandler(error, client, interaction, EmbedBuilder);
        }
    },
});

lb.blacklist = true;
lb.category = "economy";

module.exports = lb;

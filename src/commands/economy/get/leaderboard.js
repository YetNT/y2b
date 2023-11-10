const { EmbedBuilder } = require("discord.js");
const User = require("../../../models/User");
// const Inventory = require("../../models/Inventory");
const { /*comma,*/ coin } = require("../../../utils/formatters/beatify");
// const { randomItem } = require("../../utils/misc/items/items");
const errorHandler = require("../../../utils/handlers/errorHandler");

module.exports = {
    name: "leaderboard",
    description: "View the coins leaderboard and a random leaderboard",
    blacklist: true,

    callback: async (client, interaction) => {
        await interaction.deferReply();
        try {
            // const randomItemObj = randomItem();
            const server = await client.guilds.cache.get(interaction.guild.id);
            const leaderboard = await User.find({ balance: { $exists: true } })
                .sort({ balance: -1 })
                .limit(5)
                .select("userId balance -_id");

            let serverLeaderboard = [];
            const sL = await User.find({
                balance: { $exists: true },
            })
                .sort({ balance: -1 })
                .select("userId balance -_id");
            for (let user of sL) {
                let isMember = await server.members
                    .fetch(user.userId)
                    .then(() => true)
                    .catch(() => false);
                if (isMember == true) {
                    serverLeaderboard.push(user);
                }
            }
            console.log(serverLeaderboard);

            // const query = {};
            let usernames = { lb: [], item: [], slb: [] };
            // query[`inv.${randomItemObj.id}`] = { $exists: true };
            /*
            const leaderboard2 = await Inventory.find(query)
                .sort({ [`inv.${randomItemObj.id}`]: -1 })
                .limit(10)
                .select(`userId inv.${randomItemObj.id} -_id`);
            */
            // sort by descending balance, limit to top 10, select userId and balance fields, exclude _id field

            let globalLb = [];
            let globalPos = 0;
            for (let i = 0; i < leaderboard.length; i++) {
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
            for (let i = 0; i < serverLeaderboard.length; i++) {
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

            /*
            let randomItemLb = [];
            for (let i = 0; i < leaderboard2.length; i++) {
                let cachedUser = await client.users
                    .fetch(leaderboard2[i].userId)
                    .catch(() => null);
                usernames.item.push(cachedUser);
                let position =
                    i == 0
                        ? ":first_place:"
                        : i == 1
                        ? ":second_place:"
                        : i == 2
                        ? ":third_place:"
                        : `${i + 1}.`;
                randomItemLb.push(
                    `${position} ${usernames.item[i].name} - **${comma(
                        leaderboard2[i].inv[randomItemObj.id]
                    )}**`
                );
            }*/

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
                            } /*
                            {
                                name: `Random Item - ${randomItemObj.name}`,
                                value: randomItemLb.join("\n"),
                                inline: true,
                            },*/,
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
};

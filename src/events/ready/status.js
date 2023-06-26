const { ActivityType } = require("discord.js");

const presences = (client, status) => {
    let st = {};
    if (client.id == "701280304182067251") {
        let random = Math.floor(Math.random() * status.main.length);
        st = {
            status: "dnd",
            activities: [status.main[random]],
        };
    } else {
        let random = Math.floor(Math.random() * status.beta.length);
        st = {
            status: "idle",
            activities: [status.beta[random]],
        };
    }
    return st;
};

module.exports = (client) => {
    // eslint-disable-next-line no-unused-vars
    let totalMembers = 0;
    let guildCount = client.guilds.cache.size;
    client.guilds.cache.forEach((guild) => {
        totalMembers += guild.members.cache.filter(
            (member) => !member.user.bot
        ).size;
    });

    let status = {
        main: [
            {
                name: "the gulag",
                type: ActivityType.Competing,
            },
            {
                name: `${client.guilds.cache.reduce(
                    (acc, guild) => acc + guild.memberCount,
                    0
                )} idiots using Yet 2.0 | ${guildCount} servers suffering with Yet 2.0`,
                type: ActivityType.Playing,
            },
            {
                name: "made with teardrops by @yet",
                type: ActivityType.Playing,
            },
            {
                name: "Yet 2.0 Bot. Now on DJS",
                type: ActivityType.Playing,
            },
        ],
        beta: [
            {
                name: "b e t a  b o t",
                type: ActivityType.Playing,
            },
            {
                name: "b o t  b e t a",
                type: ActivityType.Competing,
            },
            {
                name: "click (=) on bot's main page",
                type: ActivityType.Listening,
            },
        ],
    };

    setInterval(() => {
        client.user.setPresence(presences(client, status));
    }, 20000);
};

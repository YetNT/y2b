const { ActivityType } = require("discord.js");

module.exports = (client) => {
    // eslint-disable-next-line no-unused-vars
    let totalMembers = 0;
    let guildCount = client.guilds.cache.size;
    client.guilds.cache.forEach((guild) => {
        totalMembers += guild.members.cache.filter(
            (member) => !member.user.bot
        ).size;
    });

    let status = [
        {
            name: "the Gulag",
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
            name: "made with teardrops by YetNT#0447",
            type: ActivityType.Playing,
        },
        {
            name: "Yet 2.0 Bot. Now on DJS",
            type: ActivityType.Playing,
        },
    ];

    setInterval(() => {
        let random = Math.floor(Math.random() * status.length);
        client.user.setPresence({
            status: "dnd",
            activities: [status[random]],
        });
    }, 20000);
};

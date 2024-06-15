const {
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    SlashCommandBuilder,
} = require("discord.js");
const { SlashCommandObject, SlashCommandManager } = require("ic4d");
const pkg = require("../../../package.json");
const errorHandler = require("../../utils/handlers/errorHandler");
const moment = require("moment");
require("moment-duration-format");

const invite = new ButtonBuilder()
    .setLabel("Invite")
    .setURL(
        "https://discord.com/oauth2/authorize?client_id=701280304182067251&permissions=412317141056&scope=applications.commands%20bot"
    )
    .setStyle(ButtonStyle.Link);
const support = new ButtonBuilder()
    .setLabel("Support Server")
    .setURL("https://discord.gg/r2rdHXTJvs")
    .setStyle(ButtonStyle.Link);

//const row1 = new ActionRowBuilder().addComponents(select);
const linkButtons = new ActionRowBuilder().addComponents(invite, support);

const info = new SlashCommandManager({
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Bot's info and other stuff"),
    async execute(interaction, client) {
        try {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Stats")
                        .setFields([
                            {
                                name: "Slash command count",
                                value: `${interaction.client.application.commands.cache.size}`,
                                inline: true,
                            },
                            {
                                name: "Total user count",
                                value: `${client.guilds.cache.reduce(
                                    (acc, guild) => acc + guild.memberCount,
                                    0
                                )}`,
                                inline: true,
                            },
                            {
                                name: "Guild count",
                                value: `${client.guilds.cache.size}`,
                                inline: true,
                            },
                            {
                                name: "Discord.js version",
                                value: `${pkg.dependencies["discord.js"]}`,
                                inline: true,
                            },
                            {
                                name: "Mongoose version",
                                value: `${pkg.dependencies.mongoose}`,
                                inline: true,
                            },
                            {
                                name: "Github repository",
                                value: `[Github repo](https://github.com/Yetity/y2b "ay bruh why u hoverin over dis?")`,
                                inline: true,
                            },
                            {
                                name: "Uptime",
                                value: moment
                                    .duration(client.uptime)
                                    .format(
                                        " D [days], H [hrs], m [mins], s [secs]"
                                    ),
                                inline: true,
                            },
                        ])
                        .setColor("#ADD8E6"),
                ],
                components: [linkButtons],
            });
        } catch (error) {
            errorHandler(error, client, interaction, EmbedBuilder);
        }
    },
});

info.category = "misc";

module.exports = info;

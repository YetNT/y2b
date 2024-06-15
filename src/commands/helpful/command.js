const {
    PermissionFlagsBits,
    EmbedBuilder,
    SlashCommandBuilder,
} = require("discord.js");
const ServerCommand = require("../../models/ServerCommand");
const errorHandler = require("../../utils/handlers/errorHandler");
const { SlashCommandManager } = require("ic4d");

const subcommands = require("./commandSubcommands/index");

const command = new SlashCommandManager({
    data: new SlashCommandBuilder()
        .setName("command")
        .setDescription(
            "Server Command Disbale/Enable/List (This command has subcommands.)"
        )
        .addSubcommand(subcommands.list.data)
        .addSubcommand(subcommands.enable.data)
        .addSubcommand(subcommands.disable.data),
    async execute(interaction, client) {
        await interaction.deferReply();
        try {
            const guildId = interaction.guild.id;
            let query = {
                guildId: guildId,
            };
            let serverCommand = await ServerCommand.findOne(query);
            let subcommand = interaction.options.getSubcommand();

            if (subcommand === "list") {
                if (!serverCommand) {
                    interaction.editReply("there is nothing.");
                    return;
                }

                await subcommands.list.callback(
                    interaction,
                    client,
                    ServerCommand,
                    serverCommand
                );
            } else if (subcommand === "enable") {
                let command = interaction.options.getString("command");

                if (!serverCommand) {
                    interaction.editReply("Command is already enabled");
                    return;
                }
                if (serverCommand[command] == false) {
                    interaction.editReply("Command is already enabled.");
                    return;
                }

                await subcommands.enable.callback(
                    interaction,
                    client,
                    ServerCommand,
                    serverCommand,
                    command
                );
            } else if (subcommand === "disable") {
                let command = interaction.options.getString("command");

                if (serverCommand && serverCommand[command] == true) {
                    interaction.editReply("Command is already disabled.");
                    return;
                }

                if (serverCommand) {
                    serverCommand[command] = true;
                } else {
                    serverCommand = ServerCommand.newDoc({
                        guildId: guildId,
                        [command]: true,
                    });
                }

                subcommands.disable.callback(
                    interaction,
                    client,
                    ServerCommand,
                    serverCommand,
                    command
                );
            }
        } catch (error) {
            errorHandler(error, client, interaction, EmbedBuilder);
        }
    },
}).setUserPermissions(PermissionFlagsBits.ManageGuild);

command.category = "mod";

module.exports = command;

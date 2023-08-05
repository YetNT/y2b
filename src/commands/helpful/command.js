const {
    PermissionFlagsBits,
    EmbedBuilder,
} = require("discord.js");
const ServerCommand = require("../../models/ServerCommand");
const errorHandler = require("../../utils/handlers/errorHandler");

const subcommands = require("./commandSubcommands/index");

module.exports = {
    name: "command",
    description:
        "Server Command Disbale/Enable/List (This command has subcommands.)",
    options: [
        subcommands.list.body,
        subcommands.enable.body,
        subcommands.disable.body,
    ],

    permissionsRequired: [PermissionFlagsBits.ManageMessages],
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        try {
            await interaction.deferReply();
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

                await subcommands.list.callback(client, interaction, serverCommand);
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
                    client,
                    interaction,
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
                    serverCommand = new ServerCommand({
                        guildId: guildId,
                        [command]: true,
                    });
                }

                subcommands.disable.callback(
                    client,
                    interaction,
                    serverCommand,
                    command
                );
            }
        } catch (error) {
            errorHandler(error, client, interaction, EmbedBuilder);
        }
    },
};

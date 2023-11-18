/* eslint-disable no-undef */
const {
    EmbedBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
} = require("discord.js");
const path = require("path");
const errorHandler = require("../../utils/handlers/errorHandler");
const {
    SlashCommandObject,
    CommandInteractionObject,
    getLocalCommands,
} = require("ic4d");
const { Pager } = require("@fyleto/dpager");

const localCommandsObject = () => {
    /**
     * @property * CommandObject
     */
    let obj = {};
    for (const command of getLocalCommands(path.join(__dirname, "../"))) {
        obj[command.name] = command;
    }

    return obj;
};

const createVars = (commands) => {
    const localCommands = localCommandsObject();
    class ApplicationCommand {
        constructor(
            id,
            name,
            category,
            description,
            options = [],
            subcommandName = undefined,
            subcommand = false
        ) {
            this.id = id;
            this.name = name;
            this.category =
                category == "misc"
                    ? "Miscellaneous"
                    : category == "economy"
                    ? "Economy"
                    : category == "mod"
                    ? "Moderator"
                    : undefined;
            this.description = description;
            this.options = options;
            this.subcommandName = subcommandName;
            this.isSubcommand = subcommand;
            this.clickable = `</${this.name}:${this.id}>`;
            this.pageContents = `**${this.clickable}** [${this.category}]\n**\`${this.description}\`**`;
        }
    }

    const economy = [];
    const misc = [];
    const mod = [];
    const all = [];

    function splitCommandAndSub(commandData) {
        if (
            commandData.options.length == 0 ||
            commandData.options.some((option) => option.type !== 1)
        )
            return {
                commandData,
                subcommands: [
                    new ApplicationCommand(
                        commandData.id,
                        commandData.name,
                        commandData.category,
                        commandData.description,
                        commandData.options
                    ),
                ],
            }; // it's not a sub command, if one of them is a subcommand then we can just get all the subcommands
        let subcommands = [];
        for (const command of commandData.options) {
            subcommands.push(
                new ApplicationCommand(
                    commandData.id,
                    commandData.name + " " + command.name,
                    commandData.category,
                    command.description,
                    command.options,
                    command.name,
                    true
                )
            );
        }
        return { commandData, subcommands };
    }

    Array.from(commands.values()).map((commandData) => {
        let a = splitCommandAndSub(commandData);
        if (!localCommands[a.commandData.name]) return;
        if (localCommands[a.commandData.name].category == "economy") {
            economy.push(...a.subcommands);
            all.push(...a.subcommands);
        }
        if (localCommands[a.commandData.name].category == "misc") {
            misc.push(...a.subcommands);
            all.push(...a.subcommands);
        }
        if (localCommands[a.commandData.name].category == "mod") {
            mod.push(...a.subcommands);
            all.push(...a.subcommands);
        }
    });
    const pageArray = [];

    for (const cmd of all) {
        pageArray.push(cmd.pageContents);
    }
    return {
        economy,
        misc,
        mod,
        arr: pageArray,
    };
};

// eslint-disable-next-line no-unused-vars
const makeWebsiteObject = (commands, eco, other) => {
    let outputObject = {
        economy: [],
        other: [],
    };
    let r;
    eco.forEach((n) => {
        r = commands.find((l) => l.name === n);
        outputObject.economy.push({
            name: r.name,
            description: r.description,
        });
    });

    other.forEach((n) => {
        r = commands.find((l) => l.name === n);
        outputObject.other.push({
            name: r.name,
            description: r.description,
        });
    });

    return outputObject;
};

const select = new StringSelectMenuBuilder()
    .setCustomId("help")
    .setPlaceholder("Pick a category")
    .addOptions(
        new StringSelectMenuOptionBuilder()
            .setLabel("Economy")
            .setDescription("All the economy commands")
            .setValue("eco")
            .setEmoji("💸"),
        new StringSelectMenuOptionBuilder()
            .setLabel("Misc commands")
            .setDescription("Commands that don't really fall under anything")
            .setValue("misc")
            .setEmoji("ℹ️"), // this is the emoji `ℹ️` not letter
        new StringSelectMenuOptionBuilder()
            .setLabel("Mod commandds")
            .setDescription("Some comands mods can use")
            .setValue("mod")
    );

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

const helpSelect = new CommandInteractionObject({
    type: "selectMenu",
    customId: "help",
    onlyAuthor: true,
    timeout: 1_000_000,
    timeoutMsg: "This interaction timed out.",
    callback: (interaction) => {
        interaction.update("k");
    },
});

const help = new SlashCommandObject(
    {
        name: "help",
        description:
            "Get help with commands. List commands and their description",

        callback: async (client, interaction) => {
            await interaction.deferReply();
            try {
                let commands = await client.application.commands.fetch({
                    locale: "en-GB",
                });
                const cmds = createVars(commands);
                const pager = new Pager("Help! (Commands list)");
                pager.addDynamicPages(cmds.arr, 6, "\n\n");
                let page = await pager.currentPage();
                let components = [...page.components, linkButtons];

                await interaction.editReply({
                    content: `Page ${pager.index + 1}/${pager.pages.length}`,
                    embeds: [page.embed],
                    components: components,
                });

                const res = await interaction.fetchReply();

                const collector = res.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    time: 3_600_000,
                });

                collector.on("collect", async (i) => {
                    let page = await pager.currentPage(i.customId);
                    let components = [...page.components, linkButtons];

                    await i.update({
                        content: `Page ${pager.index + 1}/${
                            pager.pages.length
                        }`,
                        embeds: [page.embed],
                        components: components,
                    });
                });
            } catch (error) {
                errorHandler(error, client, interaction, EmbedBuilder);
            }
        },
    },
    helpSelect
);
help.category = "misc";

module.exports = help;

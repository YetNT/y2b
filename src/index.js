/* eslint-disable no-undef */
require("dotenv").config();
const {
    Client,
    IntentsBitField,
    EmbedBuilder /* ActionRowBuilder, ButtonBuilder, ButtonStyle,*/,
} = require("discord.js");
const config = require("../config.json");
const mongoose = require("mongoose");
const { cache } = require("./models/cache.js");
const { CommandHandler, ReadyHandler, InteractionHandler } = require("ic4d");
const middleware = require("./events/middleware");
const status = require("./events/status");
const moment = require("moment");
const path = require("path");
const items = require("./utils/misc/items/items.js");
const { emojiToImage } = require("./utils/misc/emojiManipulation");
require("moment-duration-format");

const express = require("express");
const { setRoutes } = require("./events/dbPost.js");

const app = express();
app.use(express.json());

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
    ],
});

const handler = new CommandHandler(client, path.join(__dirname, "commands"), {
    devs: [...config.devs],
});
const ints = new InteractionHandler(
    client,
    path.join(__dirname, "commands"),
    {
        loadedNoChanges: "(CM) NAME was loaded. No changes were made",
        loaded: "(cm) NAME was loaded",
        deleted: "(cm) NAME was deleted",
        skipped: "(cm) NAME was skipped",
        edited: "(cm) NAME was edited",
    },
    true
);
const ready = new ReadyHandler(
    client,
    () => {
        console.log("clearing cache.");
        cache.flushAll();
    },
    (client) => {
        if (client.token === process.env.MAIN) {
            const routes = setRoutes(client);

            app.use(routes);

            app.listen(1284, () => {
                console.log(
                    ":+1: waiting for topgg and discordbotlist to respond now..."
                );
            });
        } else {
            console.log(
                "Express server not setup (Client id is not 701280304182067251)"
            );
        }
    },
    async () => {
        await handler.registerCommands();
        await ints.registerContextMenus(true);
    },
    status,
    async (client) => {
        if (client.token !== process.env.MAIN) return;
        Object.keys(items).forEach(async (key) => {
            const emoji = items[key].emoji;
            items[key].image =
                emoji !== undefined
                    ? await emojiToImage(client, emoji)
                    : undefined;
        });
        const b = [
            items,
            await client.application.commands.fetch({ locale: "en-GB" }),
        ];
        fetch("http://dono-03.danbot.host:5297/y2b/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-authority-key": process.env.Y2B_API_KEY,
            },
            body: JSON.stringify(b),
        }).catch((err) => console.error(err));
    },
    (client) => {
        console.log(`${client.user.tag} is online.`);
    }
);

(async () => {
    try {
        await handler.handleCommands(...middleware);
        ints.start("This aint your interaction!");
        await ready.execute();
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("connected to DB");

        // Use the dbPost middleware and routes
    } catch (error) {
        console.log(`db error ${error}`);
    }
})();

// Assuming you have a message ID and channel ID stored in variables
const channelId = "920947757613735966";
// const mainMessageId = "920947874156658688";
const betaMessageId = "1015333980725313558";

async function editMessage() {
    const channel = client.channels.cache.get(channelId);
    await channel.messages
        .fetch(betaMessageId)
        .then((message) => {
            message.edit({
                content: "_ _",
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Edited Message")
                        .setDescription(
                            `Message edited at: ${new Date()} \n uptime : ${moment
                                .duration(client.uptime)
                                .format(
                                    " D [days], H [hrs], m [mins], s [secs]"
                                )}`
                        )
                        .setFooter({
                            text: "This is done so that discord doesn't time out the bot's window",
                        })
                        .setColor("Random"),
                ],
            });
        })
        .catch(console.error);
}

setInterval(editMessage, 120000);
client.login(process.env.TOKEN);

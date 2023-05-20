require('dotenv').config();
const { Client, IntentsBitField,  EmbedBuilder,/* ActionRowBuilder, ButtonBuilder, ButtonStyle,*/ ActivityType} = require('discord.js');
const mongoose = require('mongoose')
const eventHandler = require('./handlers/eventHandler')
const moment = require("moment");
require("moment-duration-format");

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
});

let status = [
    {
        name: "the Gulag",
        type: ActivityType.Competing
    },
    {
        name: "wtf by Prod.$elly",
        type: ActivityType.Listening
    },
    {
        name: "Crab Game on Steam",
        type: ActivityType.Playing
    },
    {
        name: "Bot is now on JS",
        type: ActivityType.Playing
    }
];

(async () => {
	try {
        await mongoose.connect(process.env.MONGODB_URI, { keepAlive: true });
        console.log("connected to DB")

        eventHandler(client)


        client.on('ready', (c) => {
            setInterval(() => {
                let random = Math.floor(Math.random() * status.length)
                client.user.setPresence({
                    status: 'dnd',
                    activity: status[random]
                });
            }, 10000)
        })

        client.login(process.env.TOKEN);

   } catch (error) {
      console.log(`db error ${error}`)
   }
})();

// Assuming you have a message ID and channel ID stored in variables
const channelId = '920947757613735966';
const mainMessageId = '920947874156658688'; 
const betaMessageId = '1015333980725313558'

function editMessage() {
    const channel = client.channels.cache.get(channelId);
    channel.messages.fetch(betaMessageId)
        .then(message => {
            message.edit({ content: '_ _',embeds : [ new EmbedBuilder().setTitle("Edited Message").setDescription(`Message edited at: ${new Date()} \n uptime : ${moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]")}`).setFooter({text:"This is done so that discord doesn't time out the bot's window"}).setColor("Random") ] });
        })
        .catch(console.error);
}

setInterval(editMessage, 120000);


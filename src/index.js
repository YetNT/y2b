require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType } = require('discord.js');
const mongoose = require('mongoose')
const eventHandler = require('./handlers/eventHandler')

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
            client.user.setActivity(status[random])
         }, 10000)
      })

      client.login(process.env.TOKEN);

   } catch (error) {
      console.log(`db error ${error}`)
   }
})();


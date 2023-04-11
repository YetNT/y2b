require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType } = require('discord.js');

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
]

client.on('ready', (c) => {
    console.log(`${c.user.tag} is online`);

    setInterval(() => {
        let random = Math.floor(Math.random() * status.length)
        client.user.setActivity(status[random])
    }, 10000)
})

client.on('messageCreate', (message) => {
    if (message.author.bot) {
        return
    }

    if (message.content === 'button') {
        const row = new ActionRowBuilder();
        row.components.push(
            new ButtonBuilder().setCustomId('button').setLabel("button").setStyle(ButtonStyle.Primary)
        )
        message.channel.send({
            content: 'some content',
            components: [row]
        })
    }
})

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'add') {
        const num1 = interaction.options.get('num1').value;
        const num2 = interaction.options.get('num2').value;
        const ans = num1 + num2

        interaction.reply(`${num1} + ${num2} = ${num1 + num2}`)
    }


    if (interaction.commandName === 'embed') {
	const embed = new EmbedBuilder()
        .setTitle("Title")
        .setDescription("description lmao");
	const embed2 = new EmbedBuilder()
	    .setTitle("yeye")
	    .setDescription("yeyeyeye")
        .setColor('Random')
        .setFields(
            {
                name: "field",
                value:"field value",
                inline: true
            },
            {
                name:"anotherr field?!?!?",
                value: "yeah fr fr",
                inline: false
            }
        )
        
        interaction.reply({ embeds: [embed, embed2] })
    }
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;
    await interaction.deferReply({ephemeral: true});
    await interaction.editReply("ok")
})

client.login(process.env.TOKEN);

const {Client, Interaction, EmbedBuilder} = require('discord.js')
const support = "808701451399725116"
const channel = "971098250780241990"

/**
 * 
 * @param {Client} client 
 * @param {*} input 
 */
const send = async (client, input) => {
    await client.guilds.cache.get(support).channels.cache.get(channel).send(input)
}
/**
 * 
 * @param {error} error The error
 * @param {Client} client The bot's client
 * @param {Interaction} interaction The interaction
 * @param {EmbedBuilder} EmbedBuilder EmbedBuilder
 */
module.exports = async (error, client, interaction, EmbedBuilder) => {
    interaction.editReply({
        embeds : [
            new EmbedBuilder()
                .setTitle("An Error Occured!")
                .setDescription("Oops, looks like an error occured. If this is the first time you're experiencing this error, try running this command later. \n If this isn't the first time you're experiencing the error, report the error in the support server with the command name, error itself and options if there are any.")
                .setFields([
                    {
                        name:"Command",
                        value: interaction.commandName
                    },
                    {
                        name: "Error",
                        value: `${error}`
                    }
                ])
                .setColor("Red")
        ]
    })
    await send(client, { embeds : [
        new EmbedBuilder()
            .setTitle(`An error occured. Command name = ${interaction.commandName}`)
            .setTimestamp()
            .setColor("Red")
            .setFooter({text:`Server ID : ${interaction.guild.id} | User ID : ${interaction.user.id} | Error was also logged to console.`})
    ]})
    await send(client, `
        \`\`\`${error}\`\`\`
    `)
    console.log(`\n`)
    console.log(`%c==========> EROR WITH ${interaction.commandName} <==========`, 'color: red');
    console.log(`\n`)
    console.log(error)
    console.log(`\n`)
}
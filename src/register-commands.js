require('dotenv').config()
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');


const commands = [
    {
        name: 'add',
        description:'adds 2  numbers',
        options: [
            {
                name: 'num1',
                description: 'the first num',
                type: ApplicationCommandOptionType.Number,
                required: true
            },
            {
                name: 'num2',
                description: 'the second number',
                type: ApplicationCommandOptionType.Number,
                choices: [
                    {
                        name: "one",
                        value: 1
                    },
                    {
                        name: "two",
                        value: 2
                    },
                    {
                        name: "three",
                        value: 3
                    }
                ],
                required: true
            }
        ]
    },
    {
        name: 'embed',
        description: 'sends embed'
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Slash commands are being registered...')

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        )

        console.log('Done slashing the commands :+1:')
    } catch (error) {
        console.log(`Shit an error : ${error}`)
    }
})();
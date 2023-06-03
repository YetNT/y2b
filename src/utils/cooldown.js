const { Interaction, EmbedBuilder } = require('discord.js')
const Cooldown = require('../models/Cooldown');
const strToMilli = require('../utils/strToMilli')

/**
 * 
 * @param {String} time Can be a strin glike '2min' or '9d'
 * @param {Interaction} interaction 
 * @param {String} name The command's name
 * @returns 
 */
const newCooldown = async (time, interaction, name) => {
    let query = {
      userId: interaction.user.id
    };
    let date = Date.now();
    let cooldown = await Cooldown.findOne(query);
  
    if (cooldown && cooldown[name] && cooldown[name].getTime() > date) {
      return;
    }
  
    let cooldownTime;
    if (typeof time == "string") {
      cooldownTime = strToMilli(time);
    } else if (typeof time === "number") {
      cooldownTime = time;
    } else {
      throw `wtf is "${time}"`;
    }
  
    if (cooldown) {
      cooldown[name] = new Date(date + cooldownTime);
      await cooldown.save();
    } else {
      const newCooldown = new Cooldown({
        ...query,
        [name]: new Date(date + cooldownTime)
      });
      await newCooldown.save();
    }
};
  


/**
 * 
 * @param {String} name The command's name
 * @param {Interaction} interaction 
 * @param {EmbedBuilder} EmbedBuilder
 * @returns 
 */
const checkCooldown = async (name, interaction, EmbedBuilder) => {
    let query = {
        userId: interaction.user.id
    }
    let date = Date.now()

    let cooldown = await Cooldown.findOne(query)

    if (cooldown && cooldown[name]) {
        let remainingTime = cooldown[name] - date
        let endTime = Math.floor((Date.now() + remainingTime) / 1000);
        if ( remainingTime > 0 ) {
            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Cooldown")
                        .setDescription(`Slow down bro. This command has a cooldown, you will be able to run this command <t:${endTime}:R>`)
                        .setColor("Random")
                ]
            })
            return 0;
        }
    } else {
        return
    }

}

module.exports = { newCooldown, checkCooldown }
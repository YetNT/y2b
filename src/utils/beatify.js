var coinEmoji = '<:coinz:887529170316460043>'

/**
 * @param {integer} input
 * @returns string that is separated every thousand
 */
const comma = (input) => {
    return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 
 * @param {integer} input 
 * @returns string with the coin emoji
 */
const coin = (input) => {
    return `${coinEmoji}**${comma(input)}**`
}

/**
 * 
 * @param {integer} input 
 * @returns string that has been shopified (Separated with commas and linked.)
 */
const shopify = (input) => {
    return `${coinEmoji}**[${comma(input)}](https://discord.com)**`
}

module.exports = [comma, coin, shopify]
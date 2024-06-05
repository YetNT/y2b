const rndInt = require("../../../../utils/misc/rndInt");
const { comma, coin } = require("../../../../utils/formatters/beatify");

/**
 * const max = Math.floor(victim.balance / 2); // doing this so mfs dont get their whole ass robbed.
 * 
 * `You stole a grand total of ${coin(
                                    sRob
                                )} from <@${victimId}>. Leaving them with ${coin(
                                    victim.balance
                                )}`
 */
/**
 * Get the maximum value that can be stolen based on the user's balance and a random factor.
 * @param {number} balance - The current balance of the victim.
 * @returns {{max: number, outputFunction: (victimId: string, stolenAmount: number, newVictimBalance: number) => string}}
 */
function getMaxValue(balance) {
    const rand = rndInt(1, 4);
    /**
     * @param {string} victimId
     * @param {number} stolenAmount
     * @param {number} newVictimBalance
     * @returns {string}
     */
    let func = (victimId, stolenAmount, newVictimBalance) => "";
    let max = 0;

    switch (rand) {
        case 1:
            max = Math.floor(Math.floor(balance / 2) / 5);
            func = (victimId, stolenAmount, newVictimBalance) => {
                return `You stole ${coin(
                    stolenAmount
                )} from <@${victimId}>. Leaving them with ${coin(
                    newVictimBalance
                )}.`;
            };
            break;
        case 2:
            max = Math.floor(Math.floor(balance / 2) / 4);
            func = (victimId, stolenAmount, newVictimBalance) => {
                return `You stole ${coin(
                    stolenAmount
                )} from <@${victimId}>. Leaving them with ${coin(
                    newVictimBalance
                )}. Good enough.`;
            };
            break;
        case 3:
            max = Math.floor(balance / 2);
            func = (victimId, stolenAmount, newVictimBalance) => {
                return `You stole ${coin(
                    stolenAmount
                )} from <@${victimId}>. Leaving them with ${coin(
                    newVictimBalance
                )}. That's a lot.`;
            };
            break;
        case 4:
            max = rndInt(0, 1) === 0 ? Math.floor(balance / 1.2) : balance; // this seems evil as fuck.
            func = (victimId, stolenAmount, newVictimBalance) => {
                return `You stole a grand total of ${coin(
                    stolenAmount
                )} from <@${victimId}>. Leaving them with ${coin(
                    newVictimBalance
                )}. HOLY`;
            };
            break;
    }

    return { max, outputFunction: func };
}

module.exports = { isCommand: false, getMaxValue };

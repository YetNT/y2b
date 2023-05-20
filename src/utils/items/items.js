const all = require('./items.json')
const rndInt = require('../rndInt')

const withoutShield = Object.keys(all).reduce((result, key) => {
    if (all[key].id != "shield" || all[key].id != "shieldhp") {
      result[key] = all[key];
    }
    return result;
}, {});

const itemNames = () => {
    // let { shield, shieldhp, ...newInv } = all;

    let r = []
    for (let item in all) {
        r.push({
            name: all[item].name,
            value: all[item].id
        })
    }

    return r
}

const itemNamesNoShield = () => {
    let { shield, shieldhp, ...newInv } = all;

    let r = []
    for (let item in newInv) {
        r.push({
            name: newInv[item].name,
            value: newInv[item].id
        })
    }

    return r
}

/**
 * 
 * @returns {{name: String, id: String}} Returns a random item.
 */
const randomItem = () => {
    let { shield, shieldhp, ...newInv} = all;
    const itemIds = Object.values(newInv).map(item => item.id);
    const itemNames = Object.values(newInv).map(item => item.name);

    const int = rndInt(1, itemIds.length)

    return {
        name: itemNames[int - 1],
        id: itemIds[int - 1]
    }
}

module.exports = { all, withoutShield, itemNames, itemNamesNoShield, randomItem }
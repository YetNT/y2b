const all = require('./items.json')

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


module.exports = { all, withoutShield, itemNames }
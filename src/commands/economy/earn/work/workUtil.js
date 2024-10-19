const all = require("./work.json");
/**
 *
 * @returns {{ name: string, value: string }[]} An array of choice objects.
 */
function makeChoices() {
    let arr = [];
    Object.values(all).forEach((work) => {
        arr.push({
            name: work.name,
            value: work.type,
        });
    });

    return arr;
}
/**
 *
 * @param {boolean} earn
 * @param {string} id
 */
function rnd(earn, id) {
    const work = all[id];
    return {
        payment: Math.floor(Math.random() * (work.max - work.min)) + work.min,
        answer:
            earn == true
                ? work.s[Math.floor(Math.random() * work.s.length)]
                : work.f[Math.floor(Math.random() * work.f.length)],
    };
}

module.exports = { makeChoices, rnd };

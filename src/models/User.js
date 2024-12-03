const { CachedSchema } = require("./cache.js");
let Badges = require("../utils/misc/badges/badges.json");
// eslint-disable-next-line no-unused-vars
let { withoutShield } = require("../utils/misc/items/getItems");
/**
 * @typedef {Object} user
 * @property {string} userId User's ID
 * @property {number} balance User's Balance
 * @property {number} bank User's Bank balance
 * @property {Object} inventory User's Inventory
 * @property {Object} inventory.shield
 * @property {number} inventory.shield.amt The amount of shields the user has
 * @property {number} inventory.shield.hp the shield's hp
 * @property {Object} blacklist User's Blacklist status
 * @property {Object} badges User's Badges
 * @property {Object} cooldown User's Cooldowns
 * @property {Array<{name: string, endTime: Date}>} effects
 */
let scheme = {
    userId: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
    bank: {
        type: Number,
        default: 0,
    },
    badges: {},
    inventory: {
        shield: {
            amt: {
                type: Number,
                default: 0,
            },
            hp: {
                type: Number,
                default: 0,
            },
        },
    },
    blacklist: {
        ed: {
            // blacklisted
            type: Boolean,
            default: false,
        },
        reason: {
            type: String,
            default: "null",
        },
        time: {
            type: Date,
            default: new Date(0),
        },
    },
    promocode: {
        promocodeName: {
            type: Boolean,
            default: false,
        },
        bruh: {
            type: Boolean,
            default: false,
        },
        newMember: {
            type: Boolean,
            default: false,
        },
        beta: {
            type: Boolean,
            default: false,
        },
        website: {
            type: Boolean,
            default: false,
        },
    },
    cooldown: {
        rob: {
            type: Date,
            default: new Date(0),
        },
        work: {
            type: Date,
            default: new Date(0),
        },
        daily: {
            type: Date,
            default: new Date(0),
        },
        crystalize: {
            type: Date,
            default: new Date(0),
        },
        challenge: {
            buttons: {
                type: Date,
                default: new Date(0),
            },
        },
        steal: {
            type: Date,
            default: new Date(0),
        },
    },
    effects: [
        {
            name: {
                type: String,
                required: true,
            },
            endTime: {
                type: Date,
                required: true,
            },
        },
    ],
};
(async () => {
    Object.entries(Badges).forEach(([, badge]) => {
        scheme.badges[badge.id] = {
            type: Boolean,
            default: false,
        };
    });

    Object.entries(withoutShield).forEach(([, item]) => {
        const defaultAmount = item.id === "rock" ? 10 : 0;
        scheme.inventory[item.id] = {
            type: Number,
            default: defaultAmount,
        };
    });
})();

const user = new CachedSchema("user", scheme);

function invPlace() {
    let obj = { shield: { amt: 0, hp: 0 } };
    Object.entries(withoutShield).forEach((item) => {
        let defaultAmount = newInv[item].id === "rock" ? 10 : 0;
        obj[newInv[item].id] = defaultAmount;
    });
}

user.invPlace = invPlace;

module.exports = user;

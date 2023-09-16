const rndInt = require("./rndInt");

module.exports = (...text) => {
    return text[rndInt(1, text.length) - 1];
};

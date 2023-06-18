const { ActionRowBuilder } = require("discord.js");

/**
 *
 * @param {string[]} arr
 * @param {number} max
 */
const pageCreator = (arr, max) => {
    const pages = [[]]; // Initialize with an empty page
    let currentPageIndex = 0;

    for (let i = 0; i < arr.length; i++) {
        if (pages[currentPageIndex].length === max) {
            currentPageIndex++;
            pages[currentPageIndex] = []; // Create a new empty page
        }

        pages[currentPageIndex].push(arr[i]);
    }

    return pages;
};

const pagerButtons = (nextPageButton, previousPageButton, i) => {
    const previous =
        i == null || i == "next"
            ? previousPageButton.setDisabled(false)
            : previousPageButton.setDisabled(true);
    const next =
        i == null || i == "previous"
            ? nextPageButton.setDisabled(false)
            : nextPageButton.setDisabled(true);
    let row = new ActionRowBuilder().addComponents(previous, next);

    return row;
};

module.exports = { pageCreator, pagerButtons };

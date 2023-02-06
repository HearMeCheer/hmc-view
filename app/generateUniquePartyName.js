const {
    uniqueNamesGenerator,
    adjectives,
    colors,
    animals,
} = require('unique-names-generator');

const generateUniquePartyName = () =>
    uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
        separator: '-',
    });

export default generateUniquePartyName;

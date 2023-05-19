const {
    Collection
} = require('discord.js');

async function fetchMessages(channel, numberOfMessages) {
    if (!channel) {
        throw new Error(`Expected channel, got ${typeof channel}.`);
    }
    if (numberOfMessages <= 100) {
        return channel.messages.fetch({
            limit: numberOfMessages
        });
    }

    let collection = new Collection();
    let lastId = null;
    let options = {};
    let remaining = numberOfMessages;

    while (remaining > 0) {
        options.limit = remaining > 100 ? 100 : remaining;
        remaining = remaining > 100 ? remaining - 100 : 0;

        if (lastId) {
            options.before = lastId;
        }

        let messages = await channel.messages.fetch(options);

        if (!messages.last()) {
            break;
        }

        collection = collection.concat(messages);
        lastId = messages.last().id;
    }

    return collection;
}

module.exports = fetchMessages;
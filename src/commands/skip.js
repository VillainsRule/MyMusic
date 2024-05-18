import strings from '../../strings.js';

export default {
    names: ['skip', 'sk'],
    execute: async (message, client) => {
        const serverQueue = client.queue.get('queue');
        if (!serverQueue?.songs) return message.channel.send(strings.nothingToSkip);

        serverQueue.skipped = true;
        serverQueue.connection._state.subscription?.player.stop();

        return message.channel.send(strings.skipped);
    }
};
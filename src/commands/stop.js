import strings from '../../strings.js';

export default {
    names: ['stop', 's'],
    execute: async (message) => {
        const serverQueue = queue.get('queue');
        if (!serverQueue) return message.channel.send(strings.nothingToStop);

        serverQueue.songs = [];
        serverQueue.connection._state.subscription.player.stop();

        return message.channel.send(strings.stopped);
    }
};
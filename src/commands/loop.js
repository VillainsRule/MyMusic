import strings from '../../strings.js';

export default {
    names: ['loop', 'l'],
    execute: async (message, client) => {
        const serverQueue = client.queue.get('queue');

        if (!serverQueue) message.channel.send(strings.noSongToLoop);
        else if (!serverQueue.loop) {
            serverQueue.loop = true;
            message.channel.send(strings.loopEnabled);
        } else {
            serverQueue.loop = false;
            message.channel.send(strings.loopDisabled);
        };
    }
};
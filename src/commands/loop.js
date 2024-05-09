import strings from '../../strings.js';

export default {
    names: ['loop', 'l'],
    execute: async (message) => {
        const serverQueue = queue.get('queue');

        if (!serverQueue) return message.channel.send(strings.noSongToLoop);

        if (!serverQueue.loop) {
            serverQueue.loop = true;
            message.channel.send(strings.loopEnabled);
        } else {
            serverQueue.loop = false;
            message.channel.send(strings.loopDisabled);
        };
    }
};
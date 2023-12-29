import strings from '../../strings.js';

export default {
    names: ['loop', 'l'],
    execute: async (client, message, args) => {
        const serverQueue = queue.get('queue');

        if (!serverQueue) return message.channel.send(strings.noSongToLoop);

        if (!serverQueue.loop) {
            serverQueue.loop = true;
            console.log(`Started looping : ${serverQueue.songs[0].title}`);
            message.channel.send(strings.loopEnabled);
        } else {
            serverQueue.loop = false;
            console.log(`Stopped looping : ${serverQueue.songs[0].title}`);
            message.channel.send(strings.loopDisabled);
        };
    }
};
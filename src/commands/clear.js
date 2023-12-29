import strings from '../../strings.js';

export default {
    names: ['clear', 'c'],
    execute: async (client, message, args) => {
        const serverQueue = queue.get('queue');
        if (serverQueue && serverQueue.songs) serverQueue.songs = [ serverQueue.songs[0] ];
        message.channel.send(strings.cleared);
    }
};
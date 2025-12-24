import strings from '../../strings.js';

export default {
    names: ['queue', 'q'],
    execute: async (message, client) => {
        const serverQueue = client.queue.get('queue');
        if (!serverQueue || !serverQueue.songs) return message.channel.send(strings.noSongsQueued);

        let queuetxt = '';

        for (let i = 0; i < serverQueue.songs.length; i++) {
            if (serverQueue.loop === true && i === 0) queuetxt += `${i + 1}. 🔄 \`${serverQueue.songs[i].title}\` (by ${serverQueue.songs[i].author}) [requested by **@${serverQueue.songs[i].requestedby}**]\n`;
            else queuetxt += `${i + 1}. \`${serverQueue.songs[i].title}\` (by ${serverQueue.songs[i].author}) [requested by **@${serverQueue.songs[i].requestedby}**]\n`;
        };

        return message.channel.send(strings.queueTitle + '\n' + queuetxt);
    }
};
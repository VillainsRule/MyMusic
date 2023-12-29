import strings from '../../strings.js';

export default {
    names: ['queue', 'q'],
    execute: async (client, message, args) => {
        const serverQueue = queue.get('queue');
        if (!serverQueue || !serverQueue.songs) return message.channel.send(strings.noSongsQueued);

        let queuetxt = '';

        for (let i = 1; i < serverQueue.songs.length; i++) {
            let minutes = `${Math.floor(serverQueue.songs[i].duration / 60)}`;
            if (minutes.length === 1) minutes = '0' + minutes;
            let seconds = `${serverQueue.songs[i].duration % 60}`;
            if (seconds.length === 1) seconds = '0' + seconds;

            if (serverQueue.loop === true && i === 0) queuetxt += `\`\`${i + 1}. (${minutes}:${seconds}) 🔄 ${serverQueue.songs[i].title} requested by ${serverQueue.songs[i].requestedby}\`\`\n`;
            else queuetxt += `\`\`${i + 1}. (${minutes}:${seconds}) ${serverQueue.songs[i].title} requested by ${serverQueue.songs[i].requestedby}\`\`\n`;
        };

        return message.channel.send(strings.musicsQueued + '\n' + queuetxt);
    }
};
import strings from '../../strings.js';
import utils from '../utils.js';

export default {
    names: ['play', 'p'],
    execute: async (message, client, args) => {
        if (!args[0]) return message.channel.send(strings.missingSong);

        message.channel.send(strings.loadingSong);

        let voiceChannel = message.member.voice.channel;
        let serverQueue = client.queue.get('queue');

        let songInfo = await utils.searchFor(args.join(' '));

        const song = {
            title: songInfo.name,
            id: songInfo.id,
            url: songInfo.url,
            author: songInfo.artist,
            requestedby: message.author.username
        };

        if (!serverQueue || !serverQueue.songs) {
            const queueConstruct = {
                textchannel: message.channel,
                voiceChannel,
                connection: null,
                songs: [],
                volume: 1,
                playing: true,
                loop: false,
                skipped: false
            };

            client.queue.set('queue', queueConstruct);
            queueConstruct.songs.push(song);

            if (voiceChannel !== null) {
                message.channel.send(strings.playing.replace('{{SONG_TITLE}}', song.title).replace('{{URL}}', song.url));

                const connection = utils.joinVoice(voiceChannel);
                queueConstruct.connection = connection;
                utils.play(queueConstruct.songs[0], client.queue);
            } else {
                client.queue.delete('queue');
                message.channel.send(strings.playMissingVC);
            };
        } else {
            serverQueue.songs.push(song);
            message.channel.send(strings.addedtoQueue.replace('{{SONG_TITLE}}', song.title).replace('{{URL}}', song.url));
        };
    }
};
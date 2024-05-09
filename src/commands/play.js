import ytdl from 'ytdl-core';
import strings from '../../strings.js';
import utils from '../utils.js';

export default {
    names: ['play', 'p'],
    execute: async (message, args) => {
        if (!args[0]) return message.channel.send(strings.missingSong);

        let videoLink;
        if (utils.isURL(args[0])) videoLink = args[0];
        else videoLink = await utils.getUrl(args);

        let voiceChannel = message.member.voice.channel;
        const serverQueue = queue.get('queue');
        const songInfo = await ytdl.getBasicInfo(videoLink);

        const song = {
            title: songInfo.videoDetails.title,
            duration: songInfo.videoDetails.lengthSeconds,
            url: videoLink,
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

            queue.set('queue', queueConstruct);
            queueConstruct.songs.push(song);

            if (voiceChannel !== null) {
                message.channel.send(strings.playing.replace('{{SONG_TITLE}}', song.title).replace('{{URL}}', song.url));

                const connection = utils.joinVoice(voiceChannel);
                queueConstruct.connection = connection;
                utils.play(queueConstruct.songs[0]);
            } else {
                queue.delete('queue');
                message.channel.send(strings.playMissingVC);
            };
        } else {
            serverQueue.songs.push(song);
            message.channel.send(strings.addedtoQueue.replace('{{SONG_TITLE}}', song.title).replace('{{URL}}', song.url));
        };
    }
};
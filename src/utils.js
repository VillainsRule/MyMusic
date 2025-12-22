import { createAudioResource, createAudioPlayer, joinVoiceChannel } from '@discordjs/voice';
import { Readable } from 'node:stream';
import Spotify from 'searchtify';
import strings from '../strings.js';

const spotify = new Spotify();

export const downloadIfNotCached = async (song, channel, isQueue) => {
    const isDownloadedReq = await fetch('https://spotdown.org/api/check-direct-download?url=https%3A%2F%2Fopen.spotify.com%2Ftrack%2F' + song.id, {
        headers: {
            accept: '*/*'
        }
    });

    const isDownloadedRes = await isDownloadedReq.json();

    if (!isDownloadedRes.cached) {
        if (isQueue) channel.send(strings.downloadingAheadOfTime.replace('{{SONG_TITLE}}', song.title));
        else channel.send(strings.downloadingSong.replace('{{SONG_TITLE}}', song.title));

        await fetch('https://spotdown.org/api/download', {
            body: JSON.stringify({ url: 'https://open.spotify.com/track/' + song.id }),
            method: 'POST'
        });

        if (isQueue) channel.send(strings.downloadCompleted.replace('{{SONG_TITLE}}', song.title));
    }
}

const play = async (song, queue, channel) => {
    const serverQueue = queue.get('queue');

    if (!song) {
        serverQueue.connection.destroy();
        return queue.delete('queue');
    };

    downloadIfNotCached(song, channel, false);

    const finalURL = `https://spotdown.org/api/direct-download?url=https%3A%2F%2Fopen.spotify.com%2Ftrack%2F` + song.id;
    const mp3 = await fetch(finalURL);

    const resource = createAudioResource(Readable.fromWeb(mp3.body), { inlineVolume: true });
    global.client.resource = resource;

    if (channel) channel.send(strings.playing.replace('{{SONG_TITLE}}', song.title).replace('{{URL}}', song.url));

    const player = createAudioPlayer();
    serverQueue.connection.subscribe(player);

    player.play(resource);

    player.addListener('stateChange', (_, newOne) => {
        if (newOne.status == 'idle') {
            if (serverQueue.songs[0]) console.log(`Finished playing the music : ${serverQueue.songs[0].title}`);
            else console.log(`Finished playing all musics, no more musics in the queue`);
            if (serverQueue.loop === false || serverQueue.skipped === true) serverQueue.songs.shift();
            if (serverQueue.skipped === true) serverQueue.skipped = false;
            play(serverQueue.songs[0], queue);
        };
    });

    player.on('error', (error) => console.log(error));

    resource.volume.setVolume(serverQueue.volume / 10);
};

export default {
    isURL: (url) => {
        if (!url) return false;
        return new RegExp('^(https?:\\/\\/)?' +
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
            '((\\d{1,3}\\.){3}\\d{1,3}))|' +
            'localhost' +
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
            '(\\?[;&a-z\\d%_.~+=-]*)?' +
            '(\\#[-a-z\\d_]*)?$', 'i').test(url);
    },

    searchFor: async (args) => await new Promise(async (resolve) => {
        const query = await spotify.search(args);
        resolve(query.tracksV2.items[0].item);
    }),

    play,

    joinVoice: (voiceChannel) => joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator
    })
}
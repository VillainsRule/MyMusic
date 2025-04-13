import { createAudioResource, createAudioPlayer, joinVoiceChannel } from '@discordjs/voice';
import { Readable } from 'node:stream';
import Spotify from 'searchtify';

const spotify = new Spotify();

let play = async (song, queue) => {
    const serverQueue = queue.get('queue');

    if (!song) {
        serverQueue.connection.destroy();
        return queue.delete('queue');
    };

    let a = await fetch('https://spowload.com/spotify/track-' + song.id);
    let b = await a.text();

    let csrf = b.match(/"csrf-token" content="(.*?)"/)[1];

    let cookies = a.headers.getSetCookie();
    let cookie = cookies.map(c => c.split(';')[0]).join('; ');

    let r = await fetch('https://spowload.com/convert', {
        headers: {
            'content-type': 'application/json',
            'x-csrf-token': csrf,
            'cookie': cookie,
            'Referer': 'https://spowload.com/spotify/track-' + song.id,
            'Referrer-Policy': 'strict-origin-when-cross-origin'
        },
        body: JSON.stringify({ urls: 'https://open.spotify.com/track/' + song.id }),
        method: 'POST'
    });

    let body = await r.json();

    let mp3 = await fetch(body.url);

    const resource = createAudioResource(Readable.fromWeb(mp3.body), { inlineVolume: true });
    global.client.resource = resource;

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
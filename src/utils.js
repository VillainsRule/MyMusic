import { createAudioResource, createAudioPlayer, joinVoiceChannel } from '@discordjs/voice';
import { Readable } from 'node:stream';
import AppleMusic from 'apple-music';

const appleMusic = new AppleMusic();

let cachedCookie;

const extractCookies = (s) => {
    return s.split(',')
        .map(part => part.trim())
        .map(c => c.split(';').map(x => x.trim()))
        .flat()
        .filter(x => x.includes('=') && !/^(path|expires|max-age|secure|httponly|samesite)/i.test(x.split('=')[0]))
        .join('; ');
}

let play = async (song, queue) => {
    const serverQueue = queue.get('queue');

    if (!song) {
        serverQueue.connection.destroy();
        return queue.delete('queue');
    };

    const params = new URLSearchParams({
        song_name: song.title,
        artist_name: song.author,
        url: song.url,
        token: 'none',
        zip_download: 'false',
        quality: 'm4a'
    });

    const finalBody = params.toString();

    const url = await new Promise((resolve) => {
        fetch('https://aaplmusicdownloader.com/api/composer/swd.php', {
            'headers': {
                'accept': 'application/json, text/javascript, */*; q=0.01',
                'accept-language': 'en-US,en;q=0.9',
                'cache-control': 'no-cache',
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Referer': 'https://aaplmusicdownloader.com/song.php',
                cookie: 'quality=m4a; dcount=1; ' + cachedCookie
            },
            'body': finalBody,
            'method': 'POST'
        }).then(r => r.json()).then((r) => resolve(r.dlink));
    })

    const mp3 = await fetch(url);

    const resource = createAudioResource(Readable.fromWeb(mp3.body), { inlineVolume: true });
    global.client.resource = resource;

    const player = createAudioPlayer();
    serverQueue.connection.subscribe(player);

    player.play(resource);

    player.addListener('stateChange', (_, newOne) => {
        if (newOne.status == 'idle') {
            if (serverQueue.songs[0]) console.log(`finished playing ${serverQueue.songs[0].title}!`);

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
        const query = await appleMusic.search(args);
        const songs = query.results.song.data;
        const songId = songs[0].id;

        const cookieReq = await fetch('https://aaplmusicdownloader.com/');
        const rawCookies = cookieReq.headers.get('set-cookie');

        const cookiesForSend = extractCookies(rawCookies);
        cachedCookie = cookiesForSend;

        fetch('https://aaplmusicdownloader.com/api/song_url.php?url=https%3A%2F%2Fmusic.apple.com%2Fus%2Fsong%2F' + songId, {
            'headers': {
                'accept': 'application/json, text/javascript, */*; q=0.01',
                'cookie': 'quality=m4a; dcount=1; ' + cookiesForSend,
                'Referer': 'https://aaplmusicdownloader.com/',
                'Referrer-Policy': 'strict-origin-when-cross-origin'
            }
        }).then(r => r.json()).then((r) => resolve({ ...r, id: songId }));
    }),

    play,

    joinVoice: (voiceChannel) => joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator
    })
}
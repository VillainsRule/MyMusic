import YouTube from 'youtube-sr';
import ytdl from 'ytdl-core';
import { createAudioResource, createAudioPlayer, joinVoiceChannel } from '@discordjs/voice';

let play = (song) => {
    const serverQueue = queue.get('queue');

    if (!song) {
        serverQueue.connection.destroy();
        return queue.delete('queue');
    };

    let resource = createAudioResource(ytdl(song.url, {
        filter: 'audioonly',
        quality: 'highestaudio',
        highWaterMark: 1 << 25
    }), {
        inlineVolume: true
    });

    const player = createAudioPlayer();
    serverQueue.connection.subscribe(player);

    player.play(resource);

    player.addListener('stateChange', (oldOne, newOne) => {
        if (newOne.status == 'idle') {
            if (serverQueue.songs[0]) console.log(`Finished playing the music : ${serverQueue.songs[0].title}`);
            else console.log(`Finished playing all musics, no more musics in the queue`);
            if (serverQueue.loop === false || serverQueue.skipped === true) serverQueue.songs.shift();
            if (serverQueue.skipped === true) serverQueue.skipped = false;
            play(serverQueue.songs[0]);
        };
    });

    player.on('error', error => {
        console.log(error)
    });

    serverQueue.connection._state.subscription.player._state.resource.volume.setVolumeLogarithmic(serverQueue.volume / 5);
};

export default {
    isURL: function (url) {
        if (!url) return false;
        var pattern = new RegExp('^(https?:\\/\\/)?' +
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
            '((\\d{1,3}\\.){3}\\d{1,3}))|' +
            'localhost' +
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
            '(\\?[;&a-z\\d%_.~+=-]*)?' +
            '(\\#[-a-z\\d_]*)?$', 'i');
        return pattern.test(url);
    },
    getUrl: async (words) => {
        return await new Promise(async (resolve) => {
            YouTube.search(words.join(' '), { limit: 1 }).then(result => resolve('https://www.youtube.com/watch?v=' + result[0].id));
        });
    },
    play,
    joinVChannel: function (voiceChannel) {
        return joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });
    }
}
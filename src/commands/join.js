import strings from '../../strings.js';
import utils from '../utils.js';

export default {
    names: ['join', 'j', 'switch'],
    execute: async (message) => {
        let voiceChannel = message.member.voice.channel;
        let serverQueue = queue.get('queue');

        if (!voiceChannel) return message.channel.send(strings.joinMissingVC);
        if (!serverQueue) return message.channel.send(strings.joinError);

        if (serverQueue.voiceChannel.guild.id !== voiceChannel.guild.id) {
            utils.play(serverQueue.songs[0]);

            let songs = [];
            for (i = 0; i < serverQueue.songs.length; i++) songs.push(serverQueue.songs[0]);

            await serverQueue.connection._state.subscription.player.stop();

            const queueConstruct = {
                textchannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs,
                volume: serverQueue.volume,
                playing: true,
                loop: serverQueue.loop,
                skipped: false
            };

            queue.set('queue', queueConstruct);
            queueConstruct.connection = utils.joinVoice(voiceChannel);

            utils.play(queueConstruct.songs[0]);
        } else serverQueue.connection = utils.joinVoice(voiceChannel);

        return message.channel.send(strings.joined);
    }
};
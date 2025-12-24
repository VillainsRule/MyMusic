import { getVoiceConnection } from '@discordjs/voice';
import strings from '../../strings.js';

export default {
    names: ['stop', 'st'],
    execute: async (message, client) => {
        const serverQueue = client.queue.get('queue');
        if (!serverQueue) return message.channel.send(strings.nothingToStop);

        serverQueue.songs = [];
        serverQueue.connection._state.subscription.player.stop();

        getVoiceConnection(message.guild.id)?.destroy();

        return message.channel.send(strings.stopped);
    }
};
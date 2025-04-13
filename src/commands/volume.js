import strings from '../../strings.js';

export default {
    names: ['volume', 'vol', 'v'],
    execute: async (message, client, args) => {
        const serverQueue = client.queue.get('queue');
        if (!serverQueue) return message.channel.send(strings.volumeNothingPlaying);

        if (args.length === 0) return message.channel.send(strings.missingVolume);

        let floatVolume = parseFloat(args);
        if (!Number.isInteger(parseInt(args)) && ((typeof floatVolume === 'number') && (floatVolume % 1 !== 0))) return message.channel.send(strings.volumeNaN);

        if (args[0] > 10) return message.channel.send(strings.volumeTooHigh);

        serverQueue.volume = floatVolume;
        client.resource.volume.setVolume(floatVolume / 10);

        message.channel.send(strings.volumeSet.replace('{{VOLUME}}', args[0]));
    }
};
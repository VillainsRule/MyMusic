export default {
    event: 'ready',
    execute: (client) => {
        console.log(`Logged in as @${client.user.username}!\n    Guilds: ${client.guilds.cache.size}`);

        client.user.setPresence({
            activities: [{ name: 'Music!', type: 'PLAYING' }],
            status: 'dnd'
        });
    }
}
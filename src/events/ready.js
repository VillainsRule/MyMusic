export default (client) => {
    console.log(`Logged in as @${client.user.username}!\n    Guilds: ${client.guilds.cache.size}`);

    client.user.setPresence({
        activities: [{
            name: '.gg/interstellar',
            type: 'WATCHING'
        }],
        status: 'dnd'
    });
};
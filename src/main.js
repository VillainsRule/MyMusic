import { Client, Collection } from 'discord.js-selfbot-v13';
import { Player } from 'discord-player';
import fs from 'fs';

import config from '../config.js';

const client = new Client({ checkUpdate: false });

global.queue = new Map();
client.commands = new Collection();

client.player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25
    }
});

fs.readdirSync('./src/events').forEach(async (file) => {
    const event = (await import(`./events/${file}`)).default;
    client.on(file.split('.')[0], (...args) => event(client, ...args));
});

fs.readdirSync('./src/commands').forEach(async (file) => {
    let command = (await import(`./commands/${file}`)).default;
    command.names.forEach(name => client.commands.set(name, command));
});

client.login(config.token);
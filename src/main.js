import fs from 'node:fs';
import path from 'node:path';

if (!fs.existsSync(path.join(import.meta.dirname, '..', '.env'))) {
    fs.cpSync(path.join(import.meta.dirname, '..', '.env.example'), path.join(import.meta.dirname, '..', '.env'));
    console.log('please fill out the .env file in the MyMusic folder with the proper configuration, and then restart');
    process.exit(0);
}

import { Client, Collection } from 'discord.js-selfbot-v13';

const client = new Client();

global.client = client;

client.queue = new Map();
client.commands = new Collection();

for (const file of fs.readdirSync(path.join(import.meta.dirname, 'events'))) {
    const event = (await import(path.join(import.meta.dirname, 'events', file))).default;
    client.on(event.event, (...args) => event.execute(client, ...args));
}

for (const file of fs.readdirSync(path.join(import.meta.dirname, 'commands'))) {
    const command = (await import(path.join(import.meta.dirname, 'commands', file))).default;
    command.names.forEach(name => client.commands.set(name, command));
}

client.login(process.env.TOKEN);
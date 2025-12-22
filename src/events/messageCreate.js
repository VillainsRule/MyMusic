import dotenv from 'dotenv';

const canRunCommands = (id) => {
    dotenv.config({ quiet: false });

    const allowed = process.env.ALLOWED.split(',');
    if (allowed.includes(id)) return true;

    const blacklisted = process.env.BANNED.split(',');
    if (blacklisted.includes(id)) return false;

    return allowed.includes('*');
}

export default {
    event: 'messageCreate',
    execute: async (client, message) => {
        if (!message.content.startsWith(process.env.PREFIX) || message.author.id === client.user.id) return;
        if (!canRunCommands(message.author.id)) return;

        const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        const comamndData = client.commands.get(command);
        if (!comamndData) return;
        comamndData.execute(message, client, args);
    }
}
export default async (client, message) => {
    let config = (await import('../../config.js')).default;

    if (!message.content.startsWith(config.prefix) || message.author.id === client.user.id) return;
    if ((!config.allowed.includes(message.author.id) && !config.allowed.includes('*')) || config.banned.includes(message.author.id)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const comamndData = client.commands.get(command);
    if (!comamndData) return;
    comamndData.execute(message, client, args);
};
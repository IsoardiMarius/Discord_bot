import {Client, GatewayIntentBits, Partials} from "discord.js";

// Here we define the discord client
export const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel],
});

// we define the prefix for the commands
const prefix = "!"

// we listen for the message event and execute the commands
client.on("messageCreate", function(message): void {
    // check if the author is a bot
    if (message.author.bot) return;
    // check if the message starts with the prefix
    if (!message.content.startsWith(prefix)) return;

    // we split the message into an array
    const commandBody = message.content.slice(prefix.length);
    // we split the array into the command and the arguments
    const args = commandBody.split(' ');
    // we get the command
    const command = args.shift().toLowerCase();

    if (command === "ping") {
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`Pong! This message had a latency of ${timeTaken}ms.`).then(r => console.log(r));
    }

    else if (command === "sum") {
        const numArgs = args.map(x => parseFloat(x));
        const sum = numArgs.reduce((counter, x) => counter + x);
        message.reply(`The sum of all the arguments you provided is ${sum}!`).then(r => console.log(r));
    }
});
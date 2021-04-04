require('dotenv').config();

const Discord = require('discord.js');
const db = require("./models");
db.sequelize.sync();


/** Discord Commends */
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const botCommands = require('./commands')();

Object.keys(botCommands).map(key => {
    bot.commands.set(botCommands[key].name, botCommands[key]);
});
const TOKEN = process.env.TOKEN;
bot.login(TOKEN);

/** Log User Login */
bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

/** Listen Message */
bot.on('message', msg => {
    const args = msg.content.split(/ +/);
    if(args[0] !== '!mei') return;
    args.shift();
    const command = args.shift().toLowerCase();
    if (!bot.commands.has(command)) return;

    try {
        bot.commands.get(command).execute(msg, args);
    } catch (error) {
        console.error(error);
        msg.reply('there was an error trying to execute that command!');
    }
});
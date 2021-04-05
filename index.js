require('dotenv').config();

const Discord = require('discord.js');
const Cron = require('node-cron');
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
    // if(args[0] !== '!mei') return;
    if (!msg.mentions.has(bot.user.id)) return;
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

/** Cron */
const reminderCtrl = require('./controllers/reminder.controller');

Cron.schedule('* * * * *',  async function() {
    console.log('[Process] Notify Message using cron:');

    let now = new Date();
    let reminders = await reminderCtrl.reminder(now);
    var message = `Hello Travellers, \nJust remind you about: \n`;
    for (i = 0; i < reminders.data.length; i++) {
        let item = reminders.data[i];
        let hours = Math.abs(now - item.next_execute) / 36e5;
        
        if(hours <= parseInt(process.env.MAX_COUNTER)){
            message += `>> <@${item.user_id}> : ${item.name}\n`;
        }
    } 
    console.log(process.env.CHANNEL_ID);
    console.log(bot.channels.get(process.env.CHANNEL_ID));
    bot.channels.get(process.env.CHANNEL_ID).send(message);
});
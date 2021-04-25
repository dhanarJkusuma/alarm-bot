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

// run every minutes
Cron.schedule('* * * * *',  async function() {
    try{
        if(process.env.DEBUG === 'true'){
            console.log('[Reminder Bot] Notify Message using cron:');
        }
        
        let now = new Date();
        let start = new Date(now);
        start.setMinutes(start.getMinutes() - parseInt(process.env.MAX_COUNTER));

        let reminders = await reminderCtrl.reminder(start, now);
        if(reminders.data.length == 0){
            return;
        }
        
        
        var message = `Just remind you about: \n`;
        for (i = 0; i < reminders.data.length; i++) {
            let item = reminders.data[i];
            let hours = (now - item.next_execute) / 36e5;
            
            if(hours <= parseInt(process.env.MAX_COUNTER) || item.scheduled_at <= now){
                message += `${i+1}.\t<@${item.user_id}> :: ${item.name}\n`;
            }
        }
        message += `Please use confirm command to stop your reminder, or skip command to remind you later.`;

        const embedMessage = {
            color: 0x0099ff,
            title: "Notification",
            description: message,
            timestamp: new Date()
        };
        bot.channels.cache.get(process.env.CHANNEL_ID).send({ embed: embedMessage }); 
        await reminderCtrl.reload();
    }catch(error){
        console.log("[Reminder Bot] error cron: ", error);
    }
});


// run reload every 12H
// Cron.schedule('0 */12 * * *', async function(){
//     console.log('[Reminder Bot] Reload all called alarm:');
//     await reminderCtrl.reload();
// });
require('dotenv').config({ path: '../.env' });
const reminderCtrl = require('../controllers/reminder.controller');

module.exports = {
    name: 'show',
    description: 'Retrive reminder',
    async execute(msg, args) {
        const uid = msg.author.id;
        if(args.length < 1){
            msg.channel.send(`Hello <@${uid}>,  Please input with proper args\n`);
            return;
        }

        
        const name = args[0];
        let result = await reminderCtrl.show(uid, name);
        
        if(!result.success){
            let message = `Hello <@${uid}>, \nError while retrieve your reminder cry:  \nError: ${result.error} \n`;
            msg.channel.send(message);
            return;
        }

        var message;
        if(result.error != ''){
            message = `Hey  <@${uid}>, ` + result.error;
        }else{
            let last = result.data.last_executed.toLocaleString(process.env.DATE_LOCALE, { timeZone: process.env.TIMEZONE });
            let next = result.data.next_execute.toLocaleString(process.env.DATE_LOCALE, { timeZone: process.env.TIMEZONE });

            message = `Hello <@${uid}>, \nHere is detail of your reminder: \n`;
            message += `**${result.data.name}**\n`
            message += `--------------------------------------------- \n`;
            message += `${result.data.repeat}\n`;
            message += `Last remind: ${last}\n`
            message += `Next remind: ${next}`
        }

        msg.channel.send(message);
    },
};
  
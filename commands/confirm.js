require('dotenv').config({ path: '../.env' });
const reminderCtrl = require('../controllers/reminder.controller');

module.exports = {
    name: 'confirm',
    description: 'Confirm scheduler',
    async execute(msg, args) {
        const uid = msg.author.id;
        if(args.length < 1){
            msg.channel.send(`Hello <@${uid}>,  Please input with proper args\n`);
            return;
        }

        const name = args[0];
        let result = await reminderCtrl.confirm(uid, name);
        if(!result.success){
            message = `Hello <@${uid}>, \nError while confirm  your reminder :cry:  \nError: ${result.error} \n`;
            msg.channel.send(message);
            return;
        }

        var message;
        if(result.error != ''){
            message = `Hello <@${uid}>, ${result.error}`
        }else{
            let next = result.data.next_execute.toLocaleString(process.env.DATE_LOCALE);
            message = `Hello <@${uid}>, \nYour reminder ${name} has been confirmed :smile: \nWill remind you again on ${next}`;
            if(result.error != ''){
                message = `Hey  <@${uid}>, ` + result.error;
            }
        }

        
        msg.channel.send(message);
    },
};
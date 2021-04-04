const reminderCtrl = require('../controllers/reminder.controller');

module.exports = {
    name: 'show',
    description: 'Retrive reminder',
    async execute(msg, args) {

        const uid = msg.author.id;
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
            message = `Hello <@${uid}>, \nHere is detail of your reminder: \n`;
            message += `${result.data.repeat}\n`;
            message += `Last remind: ${result.data.last_executed}\n`
            message += `Next remind: ${result.data.next_execute}`
        }

        msg.channel.send(message);
    },
};
  
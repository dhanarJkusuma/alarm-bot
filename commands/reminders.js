const reminderCtrl = require('../controllers/reminder.controller');

module.exports = {
    name: 'reminders',
    description: 'Retrive reminder',
    async execute(msg, args) {

        const uid = msg.author.id;
        let result = await reminderCtrl.fetchReminder(uid);
        
        if(!result.success){
            let message = `Hello <@${uid}>, \nError while retrieve all of your reminders cry:  \nError: ${result.error} \n`;
            msg.channel.send(message);
            return;
        }

        var message = `Hello <@${uid}>, \nList of your reminders: \n`;
        for (i = 0; i < result.data.length; i++) {
            let item = result.data[i];
            message += `- ${item.name}\n`;
        } 
        msg.channel.send(message);
    },
};
  
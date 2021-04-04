const reminderCtrl = require('../controllers/reminder.controller');

module.exports = {
    name: 'reminder',
    description: 'Record reminder',
    async execute(msg, args) {

        const uid = msg.author.id;
        const now = new Date();
        const name = args[0];
        const flag = args[1];
    
        let result = await reminderCtrl.recordReminder({
            user_id: uid,
            name: name,
            executed: now,
            multiplier: flag
        });

        var message = `Hello <@${uid}>, \nYour reminder has been recorded :smile: \n`;
        if(!result.success){
            message = `Hello <@${uid}>, \nError while record your reminder :cry:  \nError: ${result.error} \n`;
        }
        msg.channel.send(message);
    },
};

  
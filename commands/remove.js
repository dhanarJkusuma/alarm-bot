const reminderCtrl = require('../controllers/reminder.controller');

module.exports = {
    name: 'remove',
    description: 'Remove reminder',
    async execute(msg, args) {

        const uid = msg.author.id;
        const name = args[0];
    
        let result = await reminderCtrl.remove(uid, name);
        if(!result.success){
            message = `Hello <@${uid}>, \nError while deleting  your reminder :cry:  \nError: ${result.error} \n`;
            msg.channel.send(message);
            return;
        }

        var message = `Hello <@${uid}>, \nYour reminder ${name} has been deleted :smile: \n`;
        if(result.error != ''){
            message = `Hey  <@${uid}>, ` + result.error;
        }
        msg.channel.send(message);
    },
};

  
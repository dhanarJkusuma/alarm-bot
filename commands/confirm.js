const reminderCtrl = require('../controllers/reminder.controller');

module.exports = {
    name: 'confirm',
    description: 'Confirm scheduler',
    async execute(msg, args) {

        const uid = msg.author.id;
        const name = args[0];
    
        let result = await reminderCtrl.confirm(uid, name);
        if(!result.success){
            message = `Hello <@${uid}>, \nError while confirm  your reminder :cry:  \nError: ${result.error} \n`;
            msg.channel.send(message);
            return;
        }

        var message = `Hello <@${uid}>, \nYour reminder ${name} has been confirmed :smile: \nWill remind you again at ${result.data.next}`;
        if(result.error != ''){
            message = `Hey  <@${uid}>, ` + result.error;
        }
        msg.channel.send(message);
    },
};
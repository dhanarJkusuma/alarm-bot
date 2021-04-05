const reminderCtrl = require('../controllers/reminder.controller');

module.exports = {
    name: 'reminder',
    description: 'Record reminder',
    async execute(msg, args) {
        const uid = msg.author.id;
        if(args.length < 2){
            msg.channel.send(`Hello <@${uid}>,  Please input with proper args\n`);
            return;
        }

        const now = new Date();
        const name = args[0];
        const flag = args[1];
    
        let result = await reminderCtrl.recordReminder({
            user_id: uid,
            name: name,
            executed: now,
            multiplier: flag
        });

        var message;
        if(!result.success){
            message = `Hello <@${uid}>, \nError while record your reminder :cry:  \nError: ${result.error} \n`;
            msg.channel.send(message);
            return;
        }
    

        if(result.error != ''){
            message = `Hello <@${uid}>, ${result.error}\n`;
        }else{
            message = `Hello <@${uid}>, \nYour reminder has been recorded :smile: \n`;
        }
        msg.channel.send(message);

        
        
    },
};

  
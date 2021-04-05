const reminderCtrl = require('../controllers/reminder.controller');

module.exports = {
    name: 'skip',
    description: 'Skip scheduler',
    async execute(msg, args) {
        const uid = msg.author.id;
        if(args.length < 2){
            msg.channel.send(`Hello <@${uid}>,  Please input with proper args\n`);
            return;
        }

        const name = args[0];
        const multiplier = args[1];
    
        let result = await reminderCtrl.skip({
            uid: uid,
            name: name,
            multiplier: multiplier
        });
        if(!result.success){
            message = `Hello <@${uid}>, \nError while skiping  your reminder :cry:  \nError: ${result.error} \n`;
            msg.channel.send(message);
            return;
        }

        var message = `Hello <@${uid}>, \nYour reminder ${name} has been skiped :smile: \nWill remind you again on ${result.data.next_execute}`;
        if(result.error != ''){
            message = `Hey  <@${uid}>, ` + result.error;
        }
        msg.channel.send(message);
    },
};
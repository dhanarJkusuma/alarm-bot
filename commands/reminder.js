const reminderCtrl = require('../controllers/reminder.controller');

module.exports = () => {
    var modules = {
        name: 'reminder',
        description: 'Record reminder',
        async execute(msg, args) {
            console.log("author " + msg.author.id);
            console.log(args);

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
    }
    return modules;
};
  
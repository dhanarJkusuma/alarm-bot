const reminderCtrl = require('../controllers/reminder.controller');

const sendError = (o, uid, msg) => {
    let message = `Hello <@${uid}>, \nError while record your reminder :cry:  \nError: ${msg} \n`;
    o.channel.send(message);
}

const isNumeric = (str) => {
    if (typeof str != "string") return false;
    return !isNaN(str) && 
           !isNaN(parseFloat(str))
}

module.exports = {
    name: 'reminder',
    description: 'Record reminder',
    async execute(msg, args) {
        const uid = msg.author.id;
        if(args.length < 2){
            sendError(msg, uid, `Please input with proper args`);
            return;
        }

        const now = new Date();
        const name = args[0];
        const flag = args[1];
        var date = null;
        if(args.length > 2){
            date = new Date(args[2]);
        }

        // validate multiplier
        let value = flag.substr(0, flag.length - 1);
        if(!isNumeric(value)){
            sendError(msg, uid, `Please input with proper repeat flag`);
            return;
        }
        let m = flag.substr(flag.length - 1);
        switch(m){
            case "d":
            case "w":
                if(value < 1){
                    sendError(msg, uid, `Please input multipler with a proper integer value`);
                    return;
                }
                break;
            case "h":
                if(value < 12){
                    sendError(msg, uid, `Please input multipler with at least 12 hour(s) reminder`);
                    return;
                }
                break;
        }
    
        let result = await reminderCtrl.recordReminder({
            user_id: uid,
            name: name,
            executed: now,
            multiplier: flag,
            customDate: date
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

  
const reminderCtrl = require('../controllers/reminder.controller');

module.exports = {
    name: 'help',
    description: 'Help func',
    async execute(msg, args) {

        var message = `Hello from alarm-bot \n`;
        message += `You can call me using this message:\n`;
        message += "```@alarm-bot <method> <args>```";
        message += `\n`;
        message += `Here is the methods available in alarm-bot:\n`;
        message += `= reminder: create new reminder.\n`;
        message += `args: <reminder name> <repeat flag> <custom_date>\n`;
        message += `Put <custom_date> if you want to start reminder from specific date\n`
        message += `Example: `
        message += "```@alarm-bot reminder my-alarm 1d 2021-04-25T10:47:54+07:00```"
        message += `\n`
        message += `= reminders: get your reminder. \n`;
        message += `Example: `
        message += "```@alarm-bot reminders```"
        message += `\n`
        message += `= show: get detail of your reminder.\n`;
        message += `args: <reminder name>\n`;
        message += `Example: `
        message += "```@alarm-bot my-alarm```"
        message += `\n`
        message += `= remove: remove your specific reminder.\n`;
        message += `args: <reminder name>\n`;
        message += `Example: `
        message += "```@alarm-bot remove my-alarm```"
        message += `\n`
        message += `= confirm: confirm you reminder.\n`;
        message += `args: <reminder name>\n`;
        message += `Example: `
        message += "```@alarm-bot confirm my-alarm```"
        message += `\n`
        message += `= skip: skip you reminder. args: <reminder name>\n`;
        message += `args: <reminder name>\n`;
        message += `Example: `
        message += "```@alarm-bot skip my-alarm 1h```"
        message += `\n`
        message += `--------------------------------------------- \n`;
        message += `Available repeat flag: \n`;
        message += `w: Week \n`;
        message += `d: Day \n`;
        message += `h: Hour \n`;
        message += `example: 1h, 2d, 1w\n`;
        message += `Note: you can only create reminder within at least 12h reminder`;
        const embedMessage = {
            color: 0x0099ff,
            title: "Help",
            description: message,
            timestamp: new Date()
        };

        msg.channel.send({ embed: embedMessage });
    },
};

  
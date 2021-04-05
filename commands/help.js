const reminderCtrl = require('../controllers/reminder.controller');

module.exports = {
    name: 'help',
    description: 'Help func',
    async execute(msg, args) {

        var message = `Welcome from mei bot :smile: \n`;
        message += `You can call me using this message:\n`;
        message += "```@mei-bot <method> <args>```";
        message += `\n`;
        message += `Here is the methods available in mei bot:\n`;
        message += `- reminder: create new reminder. args: <reminder name> <repeat flag>\n`;
        message += `- reminders: get your reminder. args: - \n`;
        message += `- show: get detail of your reminder. args: <reminder name> \n`;
        message += `- remove: remove your specific reminder. args: <reminder name> \n`;
        message += `- confirm: confirm you reminder. args: <reminder name> \n`;
        message += `- skip: skip you reminder. args: <reminder name> <repeat flag in hour(s)> \n`;
        message += `--------------------------------------------- \n`;
        message += `Available repeat flag: \n`;
        message += `w: Week \n`;
        message += `d: Day \n`;
        message += `h: Hour \n`;
        message += `example: 1h, 2d, 1w`;
        
        msg.channel.send(message);
    },
};

  
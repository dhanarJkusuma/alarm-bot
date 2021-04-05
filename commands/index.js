module.exports = () => {
    var cmdModules = {};
    cmdModules.Ping = require('./ping');
    cmdModules.Reminder = require('./reminder');
    cmdModules.Reminders = require('./reminders');
    cmdModules.Remove = require('./remove');
    cmdModules.Show = require('./show');
    cmdModules.Confirm = require('./confirm');
    cmdModules.Skip = require('./skip');
    cmdModules.Help = require('./help');
    return cmdModules;
};
  
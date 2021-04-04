module.exports = (dbRef) => {
    var cmdModules = {};
    cmdModules.Ping = require('./ping');
    cmdModules.Reminder = require('./reminder')(dbRef);
    return cmdModules;
};
  
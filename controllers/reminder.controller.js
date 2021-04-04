const Sequelize = require("sequelize");
const { sequelize } = require("../models");

const model = require("../models");
const Scheduler = model.Scheduler;
const Op = model.Sequelize.Op;

exports.recordReminder = async (data) => {
    var success = false;
    var error_msg = "";
    try{
        const nextDate = parseMultiplier(data.executed, data.multiplier);
        await Scheduler.create({
            user_id: data.user_id,
            name: data.name,
            last_executed: data.executed,
            next_execute: nextDate,
            multiplier: data.multiplier
        });

        success = true;
    }catch(error){
        console.log('[Mei Bot] error while creating record', error);
        if (error instanceof Sequelize.UniqueConstraintError){
            error_msg = "Duplicate Name!";
        }else{
            error_msg = "Internal System Error";
        }
    }

    return {
        success,
        error: error_msg
    };
};

exports.fetchReminder = async (uid) => {
    var success = true;
    var error_msg = "";
    var schedulers = [];
    try{
        schedulers = await Scheduler.findAll({ where: { user_id: uid }, raw: true });

    }catch(error){
        console.log('[Mei Bot] error while fetching record. Error: ', error);
        success = false;
        error_msg = "Internal System Error";
    }

    return {
        success,
        error: error_msg,
        data: schedulers
    }
}

exports.remove = async (uid, name) => {
    var success = false;
    var error_msg = "";
    try{
        let count = await Scheduler.destroy({ where: { user_id: uid, name: name } });
        if(count == 0){
            error_msg = `Your reminder with name ${name} is not found :triumph:`;
        }

        success = true;
    }catch(error){
        console.log('[Mei Bot] error while deleting record', error);
        error_msg = "Internal System Error";
    }

    return {
        success,
        error: error_msg
    };
};

exports.show = async (uid, name) => {
    var success = true;
    var error_msg = "";
    var scheduler = null;
    try{
        scheduler = await Scheduler.findOne({ where: { user_id: uid, name: name }, raw: true });
        if (scheduler === null) {
            error_msg = `Your reminder with name ${name} is not found :triumph:`;
        }else{
            scheduler.repeat = parseMultiplierDescription(scheduler.multiplier);
        }

    }catch(error){
        console.log('[Mei Bot] error while fetching record', error);
        error_msg = "Internal System Error";
        success = false;
    }

    return {
        success,
        error: error_msg,
        data: scheduler
    };
};

const parseMultiplier = (date, multiplier) => {
    let m = multiplier.substr(multiplier.length - 1);
    let v = multiplier.length == 1 ? 1 : parseInt(multiplier.substr(0, multiplier.length - 1));
    let d = new Date(date);
    switch(m){
        case "w":
            d.setDate(d.getDate() + v * 7);
            return d;
        default:
            return d;
    }
}

const parseMultiplierDescription = (multiplier) => {
    let m = multiplier.substr(multiplier.length - 1);
    let v = multiplier.length == 1 ? 1 : parseInt(multiplier.substr(0, multiplier.length - 1));
    switch(m){
        case "w":
            return `Will remind you every ${v} week(s)`;
        default:
            return `This reminder was broken, please remove this reminder!`;
    }
}
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
        if(nextDate == null){
            error_msg = "Please input with proper repeat flag";
            return {
                success,
                error: error_msg
            };
        }
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

exports.skip = async (data) => {
    let transaction;
    var success = true;
    var error_msg = "";
    var scheduler = null;

    try {
        transaction = await sequelize.transaction();

        scheduler = await Scheduler.findOne({ where: { 
            user_id: data.uid, 
            name: data.name 
        }, raw: true, transaction: transaction, lock: true });
        if (scheduler === null) {
            error_msg = `Your reminder with name ${data.name} is not found :triumph:`;
            return {
                success,
                error: error_msg,
                data: null
            };
        }

        let now = new Date();
        if(scheduler.next_execute > now){
            error_msg = `Cannot skip reminder ${data.name} :expressionless: \n`;
            error_msg += `This reminder is too far away`;

            return {
                success,
                error: error_msg,
                data: null
            };
        }

        let flag = getFlag(data.multiplier);
        if(flag != 'h'){
            error_msg = `You can only skip this reminder in a few hours :pleading_face:`;
            return {
                success,
                error: error_msg,
                data: null
            };
        }

        let now = new Date();
        let next = parseMultiplier(now, data.multiplier);
        scheduler.next_execute = next;
        await Scheduler.update({
            confirmed: true,
            next_execute: next
        }, { 
            where: { id: scheduler.id }, 
            transaction 
        });
        await transaction.commit();

    } catch (error) {
        console.log('[Mei Bot] error while skip reminder record', error);
        if (transaction) await transaction.rollback();

        error_msg = "Internal System Error";
        success = false;
    }

    return {
        success,
        error: error_msg,
        data: scheduler
    };
}

exports.confirm = async (uid, name) => {
    let transaction;
    var success = true;
    var error_msg = "";
    var scheduler = null;

    try {
        transaction = await sequelize.transaction();

        scheduler = await Scheduler.findOne({ where: { 
            user_id: uid, 
            name: name 
        }, raw: true, transaction: transaction, lock: true });
        if (scheduler === null) {
            error_msg = `Your reminder with name ${name} is not found :triumph:`;

            return {
                success,
                error: error_msg,
                data: null
            };
        }

        let now = new Date();
        if(scheduler.next_execute > now){
            error_msg = `No need to confirm reminder ${name} :expressionless: \n`;
            error_msg += `This reminder is too far away`;

            return {
                success,
                error: error_msg,
                data: null
            };
        }

        let next = parseMultiplier(scheduler.last_executed, scheduler.multiplier);
        scheduler.next_execute = next;
        await Scheduler.update({
            confirmed: true,
            next_execute: next
        }, { 
            where: { id: scheduler.id }, 
            transaction 
        });
        await transaction.commit();

    } catch (error) {
        console.log('[Mei Bot] error while conrim reminder record', error);
        if (transaction) await transaction.rollback();

        error_msg = "Internal System Error";
        success = false;
    }

    return {
        success,
        error: error_msg,
        data: scheduler,
        next
    };
}

exports.reminder = async (from, end) => {
    var success = true;
    var error_msg = "";
    var schedulers = [];
    try{
        schedulers = await Scheduler.findAll({ where: { 
            next_execute: {
                [Op.between]: [from, end]
            },
            confirmed: false
        }, raw: true });

    }catch(error){
        console.log('[Mei Bot] error while fetching reminder records. Error: ', error);
        success = false;
        error_msg = "Internal System Error";
    }

    return {
        success,
        error: error_msg,
        data: schedulers
    }
}

const getFlag = (multiplier) => {
    return multiplier.substr(multiplier.length - 1);
}

const parseMultiplier = (date, multiplier) => {
    let value = multiplier.substr(0, multiplier.length - 1);
    if(!isNumeric(value)){
        return null;
    }
    let m = multiplier.substr(multiplier.length - 1);
    let v = multiplier.length == 1 ? 1 : parseInt(value);
    let d = new Date(date);
    switch(m){
        case "w":
            d.setDate(d.getDate() + v * 7);
            return d;
        case "d":
            d.setDate(d.getDate() + v);
            return d;
        case "h":
            d.setHours(d.getHours() + v);
            return d;
        default:
            return null;
    }
}

const parseMultiplierDescription = (multiplier) => {
    let m = multiplier.substr(multiplier.length - 1);
    let v = multiplier.length == 1 ? 1 : parseInt(multiplier.substr(0, multiplier.length - 1));
    switch(m){
        case "w":
            return `Will remind you every ${v} week(s)`;
        case "d":
            return `Will remind you every ${v} day(s)`;
        case "h":
            return `Will remind you every ${v} hour(s)`;
        default:
            return `This reminder was broken, please remove this reminder!`;
    }
}

const isNumeric = (str) => {
    if (typeof str != "string") return false;
    return !isNaN(str) && 
           !isNaN(parseFloat(str))
}
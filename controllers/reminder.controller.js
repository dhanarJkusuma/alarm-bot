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

        let flag = getFlag(data.multiplier);
        if(flag != 'h'){
            error_msg = `You can skip this reminder in just a few hours :pleading_face:`;
            return {
                success,
                error: error_msg,
                data: null
            };
        }

        let next = parseMultiplier(scheduler.next_execute, data.multiplier);

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
        data: {
            next: next
        }
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

        let next = parseMultiplier(scheduler.last_executed, data.multiplier);

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
        data: scheduler
    };
}

exports.reminder = async (date) => {
    var success = true;
    var error_msg = "";
    var schedulers = [];
    try{
        schedulers = await Scheduler.findAll({ where: { 
            next_execute: {
                [Op.lte]: date
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
    let m = multiplier.substr(multiplier.length - 1);
    let v = multiplier.length == 1 ? 1 : parseInt(multiplier.substr(0, multiplier.length - 1));
    let d = new Date(date);
    switch(m){
        case "w":
            d.setDate(d.getDate() + v * 7);
            return d;
        case "d":
            d.setDate(d.getDate() + v);
            return d;
        case "h":
            d.setDate(d.getHours() + v );
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
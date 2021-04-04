const Sequelize = require("sequelize");

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
        console.log('error while creating record', error);
        if (error instanceof Sequelize.UniqueConstraintError){
            error_msg = "Duplicate Name!";
        }else{
            error_msg = "Unknown System Error";
        }
    }

    
    return {
        success,
        error: error_msg
    };
};

const parseMultiplier = (date, multiplier) => {
    let m = multiplier.substr(multiplier.length - 1);
    let v = multiplier.length == 1 ? 1 : parseInt(multiplier.substr(0, multiplier.length - 1));
    let d = date;
    switch(m){
        case "w":
            d.setDate(d.getDate() + v * 7);
            return d;
        default:
            return date;
    }
}
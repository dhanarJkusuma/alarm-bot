require('dotenv').config();
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER,
    process.env.DB_PASS, 
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        operatorsAliases: false,

        pool: {
            max: parseInt(process.env.DB_MAX_POOL),
            min: parseInt(process.env.DB_MIN_POOL),
            acquire: parseInt(process.env.DB_ACQUIRE),
            idle: parseInt(process.env.DB_IDLE)
        },
        logging: process.env.DEBUG === 'true'
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Scheduler = require("./scheduler.model")(sequelize, Sequelize);

module.exports = db;

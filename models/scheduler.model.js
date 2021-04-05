
module.exports = (sequelize, Sequelize) => {
    const Scheduler = sequelize.define("schedulers", {
        /** attributes */
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: Sequelize.STRING(30),
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        last_executed: {
            type: Sequelize.DATE(),
            defaultValue: Sequelize.NOW
        },
        next_execute: {
            type: Sequelize.DATE(),
            defaultValue: Sequelize.NOW
        },
        multiplier: {
            type: Sequelize.STRING,
            allowNull: false
        },
        confirmed: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    },{
        /** indexes */
        indexes: [    
            {
                unique: true,
                fields: ['user_id','name']
            },
            {
                name: 'reminder_idx',
                fields: ['next_execute', 'confirmed']
            }
        ],
    });
    return Scheduler;
  };
  
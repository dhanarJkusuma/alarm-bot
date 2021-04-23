
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
        scheduled_at: {
            type: Sequelize.DATE(),
            defaultValue: Sequelize.NOW
        },
        next_execute: {
            type: Sequelize.DATE(),
            defaultValue: Sequelize.NOW
        },
        value_multiplier: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        multiplier: {
            type: Sequelize.STRING,
            allowNull: false
        },
        db_multiplier: {
            type: Sequelize.STRING,
            allowNull: false
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
  
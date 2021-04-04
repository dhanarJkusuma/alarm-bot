
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
        }
    },{
        /** indexes */
        indexes: [    
            {
                unique: true,
                fields: ['user_id','name']
            }
        ],
        createdAt: 'next_execute'
    });
    return Scheduler;
  };
  
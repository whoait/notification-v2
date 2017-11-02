'use strict';
module.exports = function (sequelize, DataTypes) {
    const bind_notification = sequelize.define('bind_notification', {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        message_type: DataTypes.STRING,
        title: DataTypes.STRING,
    }, {
        underscored: true,
        classMethods: {
            associate: function (models) {
                // associations can be defined here
            }
        }
    });
    return bind_notification;
};
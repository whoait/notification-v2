'use strict';
module.exports = function (sequelize, DataTypes) {
    const bind_notification_detail = sequelize.define('bind_notification_detail', {
        parent_id: DataTypes.UUID,
        display_title: DataTypes.STRING,
        sub_title: DataTypes.STRING,
        date: DataTypes.STRING,
        start_date: DataTypes.DATE,
        end_date: DataTypes.DATE,
        content: DataTypes.TEXT,
        ext_link: DataTypes.STRING,
        modal_link: DataTypes.STRING,
        limit: DataTypes.INTEGER,
        bind_version: DataTypes.TEXT,
        status: DataTypes.INTEGER,
        display_area: DataTypes.INTEGER,
        delete_flag: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    }, {
        underscored: true,
        classMethods: {
            associate: function (models) {
                // associations can be defined here
                bind_notification_detail.belongsTo(models.bind_notification, {
                    foreignKey: 'parent_id'
                })
            }
        }
    });
    return bind_notification_detail;
};
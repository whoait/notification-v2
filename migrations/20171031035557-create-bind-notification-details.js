'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('bind_notification_details', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true

            },
            parent_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: "bind_notifications",
                    key: "id",
                    as: "parent_id"
                }
            },
            display_title: {
                type: Sequelize.STRING
            },
            sub_title: {
                type: Sequelize.STRING
            },
            date: {
                type: Sequelize.STRING
            },
            start_date: {
                type: Sequelize.DATE
            },
            end_date: {
                type: Sequelize.DATE
            },
            content: {
                type: Sequelize.TEXT
            },
            ext_link: {
                type: Sequelize.STRING
            },
            modal_link: {
                type: Sequelize.STRING
            },
            limit: {
                type: Sequelize.INTEGER
            },
            is_cld: {
                type: Sequelize.BOOLEAN
            },
            is_clt: {
                type: Sequelize.BOOLEAN
            },
            is_bind11: {
                type: Sequelize.BOOLEAN
            },
            is_bind11T: {
                type: Sequelize.BOOLEAN
            },
            is_bind10: {
                type: Sequelize.BOOLEAN
            },
            is_bind10T: {
                type: Sequelize.BOOLEAN
            },
            is_bind9: {
                type: Sequelize.BOOLEAN
            },
            is_bind9T: {
                type: Sequelize.BOOLEAN
            },
            status: {
                type: Sequelize.INTEGER
            },
            display_area: {
                type: Sequelize.INTEGER
            },
            delete_flag: {
                type: Sequelize.BOOLEAN
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('bind_notification_details');
    }
};
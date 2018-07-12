'use strict';
module.exports = {
    up: function (queryInterface, Sequelize){

        return queryInterface.sequelize.query(
            "ALTER SEQUENCE bind_notification_details_id_seq RESTART WITH 300"
        );

    },

    down: function (queryInterface, Sequelize) {

    }
}
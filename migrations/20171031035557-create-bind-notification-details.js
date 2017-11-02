'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('bind_notification_details', {
        uuid: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            unique: true,
            defaultValue: Sequelize.UUIDV4,

        },
      parent_id: {
        type: Sequelize.UUID,
          references: {
              model: "bind_notifications",
              key: "uuid",
              as: "parent_id"
          }
      },
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      sub_title: {
        type: Sequelize.STRING
      },
      start_date: {
        type: Sequelize.DATE
      },
      end_date: {
        type: Sequelize.DATE
      },
      content: {
        type: Sequelize.STRING
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
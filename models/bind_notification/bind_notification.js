'use strict';
module.exports = function(sequelize, DataTypes) {
  var bind_notification = sequelize.define('bind_notification', {
    message_type: DataTypes.STRING,
    title: DataTypes.STRING
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return bind_notification;
};
'use strict';
module.exports = function(sequelize, DataTypes) {
  var bind_notification_detail = sequelize.define('bind_notification_detail', {
    parent_id: DataTypes.UUID,
    id: DataTypes.INTEGER,
    sub_title: DataTypes.STRING,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    content: DataTypes.STRING,
    ext_link: DataTypes.STRING,
    modal_link: DataTypes.STRING,
    limit: DataTypes.INTEGER,
    is_cld: DataTypes.BOOLEAN,
    is_clt: DataTypes.BOOLEAN,
    is_bind11: DataTypes.BOOLEAN,
    is_bind10: DataTypes.BOOLEAN,
    is_bind10T: DataTypes.BOOLEAN,
    is_bind9: DataTypes.BOOLEAN,
    is_bind9T: DataTypes.BOOLEAN,
    status: DataTypes.INTEGER,
    delete_flag: DataTypes.BOOLEAN
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return bind_notification_detail;
};
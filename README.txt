Database:
// Set up database connection information in config/config.json

// Run scripts to create db
$ sequelize db:migrate --migrations-path migrations/bind_notification --config config/config.json
$ sequelize db:migrate --migrations-path migrations/bind_notification_detail --config config/config.json
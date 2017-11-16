Install required packages:
$ npm install

Database:
// Set up database connection information in config/config.json

// Run scripts to create db
$ sequelize db:migrate --migrations-path migrations/ --config config/config.json
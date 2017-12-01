//Install required packages:
$ npm install

//Database: Set up database connection information in config/config.json

// Run scripts to create db
$ sequelize db:migrate --migrations-path migrations/ --config config/config.json

// Run server:
$ npm start

//After running server, by default, index page should be: http://localhost:3000

Note:
+ If you want to auto-reload project when editing content in components, run this script:
$ webpack -w

Project structure:
+ All components is stored in bind_notification_server/app folder.
+ All api specifications is stored in bind_notification_server/routers/index.js file.
+ All business code in server side is stored in bind_notification_server/services folder.
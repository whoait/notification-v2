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

// Fix text garbling（文字化け）
after npm install,
download zip follow link and rewrite node_modules/aor-language-japanese/index.js.
https://github.com/kuma-guy/aor-language-japanese

//fix issue 342- (bundle.js:781 Warning: Missing translation for key)
copy and overwrite file index.js from:
bind_notification_server\aor_language
to:
bind_notification_server \ node_modules \ aor-language-japanese \ index.js
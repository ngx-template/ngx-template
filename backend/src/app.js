/**
 * Module dependencies.
 */
 const express = require('express');
 const helmet = require('helmet');
 const routes = require('./routes/routes');
 const path = require("path");
 require('dotenv').config();
 
 const app = express();
 
 const back_config = {
   checkToken: false,
   swagger: true,
   cors: true,
   logger: true,
   session: true
 }
 
 for (let extension in back_config) {
   if (back_config[extension]) {
     require(`./configs/${extension}`)(app);
   }
 }
 
 app.use(express.json());
 app.use(express.urlencoded({
   extended: false
 }));
 app.use(helmet());
 
 
for(let route of routes){
  if(!route.checkToken){
      app.use(process.env.API_BASE_PATH + "/" + route.path, require(`./routes/${route.router}`));
  }
}

 
 // catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).send({
    code: 404,
    error: 'route not found'
  })
});
 
 // error handler
 app.use(function (err, req, res, next) {
   // set locals, only providing error in development
   res.locals.message = err.message;
   res.locals.error = req.app.get('env') === 'dev' ? err : {};
 
   res.status(err.status || 500);
   res.send(res.locals.message);
 });
 
 module.exports = app;
//this is needed for importing express js into our application

const express = require('express')
const appConfig= require('./config/appConfig')
//declaring an instance or creating an application instance
const app = express()

//add follow line for adding route
const fs=require('fs')

//add follow for mongoose 
const mongoose=require('mongoose')

//add helmet for security purpose(npm install helmet --save via cmd)
const helmet=require('helmet')

//add http which is a part  of Node js
const http=require('http')


//add body-parser for body parameters(ihva installed it via cmd also ..npm install body-parser --save)
const bodyParser=require('body-parser')
const cookieParser=require('cookie-parser')
const globalErrorMiddleware=require('./middlewares/appErrorHandler')
const routeLoggerMiddleware=require('./middlewares/routeLoggers')
const logger=require('./libs/loggerLib')

//add middleware for body-parameters
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser())

app.use(globalErrorMiddleware.globalErrorHandler)
app.use(routeLoggerMiddleware.logIp)
app.use(helmet())


/*-----------NOTE:ALWAYS ADD BOOTSTRAP MODEL CODE FIRST AND THEN ADD BOOTSTRAP ROUTE CODE,--------------
----------------------OTHERWISE U WILL GET MISSING SCHEMA ERROR-----------------------------------------*/

//-----------add bootstrap models----------------
let modelsPath='./models'
fs.readdirSync(modelsPath).forEach(function(file)
{//readdir Sync will check if any .js file exist inside models folder or not
if(~file.indexOf('.js'))
    {
    console.log(file)
    require(modelsPath+'/'+file)
    }
});//end of bootstrap models


//--------------add bootstrap route------------------

let routesPath='./routes'
fs.readdirSync(routesPath).forEach(function(file){//readdir Sync will check if any .js file exist inside routes folder or not
if(~file.indexOf('.js')){
    console.log("including the following file")
    console.log(routesPath+'/'+file)
    let route=require(routesPath+'/'+file)
    route.setRouter(app);
}
});//end of bootstrap route

//----------------------------------------------------------------------------------------------------
  // calling global 404 handler after route

app.use(globalErrorMiddleware.globalNotFoundErrorHandler)

  // end  global 404 handler 

//-------------------------------------------------------------------------------------------------------
/*app.listen(appConfig.port,()=>{
   console.log('example app is listening on port num 3000!')
   //creating connection to mongoDb
   let db=mongoose.connect(appConfig.db.uri,{useNewUrlParser:true})
})

----instead of this code create http server and then add two functions called
onError() and onListening()  and process.on() for http event releated functionality as follows: ...*/
/**
 * Create HTTP server.
 */

const server = http.createServer(app)
// start listening to http server
console.log(appConfig)
server.listen(appConfig.port)
server.on('error', onError)
server.on('listening', onListening)

// end server listening code

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        logger.error(error.code + ' not equal listen', 'serverOnErrorHandler', 10)
        throw error
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            logger.error(error.code + ':elavated privileges required', 'serverOnErrorHandler', 10)
            process.exit(1)
            break
        case 'EADDRINUSE':
            logger.error(error.code + ':port is already in use.', 'serverOnErrorHandler', 10)
            process.exit(1)
            break
        default:
            logger.error(error.code + ':some unknown error occured', 'serverOnErrorHandler', 10)
            throw error
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address()
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    ('Listening on ' + bind)
    logger.info('server listening on port' + addr.port, 'serverOnListeningHandler', 10)
    let db = mongoose.connect(appConfig.db.uri, { useNewUrlParser:true})
}

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
    // application specific logging, throwing an error, or other logic here
})
//-----------------------------------------------------------------------------------------------

//mongoose connection error
mongoose.connection.on('error',function(err){
    console.log('database connection error');
    console.log(err)
})//end of mongoose connection error

//mongoose connection success msg
mongoose.connection.on('open',function(err){
   if(err){ 
          console.log('database error');
         }else{
             console.log('database connection success')
         }

})//end of mongoose connection success msg
















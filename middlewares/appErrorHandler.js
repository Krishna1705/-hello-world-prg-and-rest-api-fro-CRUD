/*if it founds any err then,this following errorhandler break the request 
before it reaches to the controller...*/

const response = require('./../libs/responseLib')
const logger=require('./../libs/loggerLib')

let errorHandler=(err,req,res,next)=>{

    console.log("application error handler called.")
    console.log(err);

    logger.error(err.message,"appErrorHandler:Application Level Error",10)
    
    let apiResponse=response.generate(true,"Some Error Occured at Global Level",500,null)
    res.send(apiResponse)
}

//following method will be returns when there is no any blog found

let notFoundHandler=(req,res,next)=>{

    console.log('Global not found handler called');
    logger.info("Route Not Found","appErrorHandler:Global Not Found Error",8)

    let apiResponse=response.generate(true,'Route not found in the application',404,null)
    res.status(404).send(apiResponse)
}

module.exports={
    globalErrorHandler:errorHandler,
    globalNotFoundErrorHandler:notFoundHandler
}
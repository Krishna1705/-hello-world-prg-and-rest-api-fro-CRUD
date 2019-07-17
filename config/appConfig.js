let appConfig={};//declare an object

appConfig.port=3000;
appConfig.allowedCorsOrigin="*";
appConfig.env="dev";
appConfig.db={
uri:'mongodb://test:test@127.0.0.1:27017/blogAppDB',
}
appConfig.apiVersion='/api/v1';

//now to use this things in another files we will make use of module.exports
//create an object again

module.exports={
    port:appConfig.port,
    allowedCorsOrigin:appConfig.allowedCorsOrigin,
    environment:appConfig.env,
    db:appConfig.db,
    apiVersion:appConfig.apiVersion
}//end of module.exports
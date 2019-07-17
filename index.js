/*this is needed for importing express js into our application,
we already have installed express js into our app first,but still we need to use follow code,
coz express js is minimilistick,so all the things which u want to use in ur app,
must be imported in code also...*/

const express = require('express')
const appConfig= require('./config/appConfig')
//declaring an instance or creating an application instance
const app = express()
const port = 3000

let helloWorldFunction= (req, res) => res.send('Hello World krishna monik patel !')
//defining some route
app.get('/',helloWorldFunction)

/* -------------creating a local server--------------------------
listening the server on port..3000..
we can use any port number which is open in our computer,but by default node js 
is using port 3000,so we also are using port num-3000 */
app.listen(appConfig.port, () => console.log(`Example app listening on port ${port}!`))
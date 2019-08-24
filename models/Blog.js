const mongoose=require('mongoose')
//mongoose already contain defination of schema
const Schema=mongoose.Schema
//schema defination is as followas:
//schema declaration helps to structure the blog application
//it tells that what to store in the blogs & how to store object in my blog collection.
//it helps to maintain data consistency,so if in case bcaz of bug or some error if there is absense of any value of key
//then it will find the key from the schema and assigns default value to that particular key
const time=require('./../libs/timeLib')


let blogSchema=new Schema({

    blogId:{
        type:String,
        unique:true
    },
    title:{
        type:String,
        default:''
    },
    description:{
        type:String,
        default:''
    },
   bodyHtml:{
        type:String,
        default:''
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:false
    },
    category:{
        type:String,
        default:''
    },
    author:{
        type:String,
        default:''
    },
    tags:[],
    created:{
        type:Date,
        default:''
    },
    lastModified:{
        type:Date,
        default:''
    }

})//end of schema defination

//follow line tells the mongoose that this schema is going to be accepted into a model
mongoose.model('Blog',blogSchema)
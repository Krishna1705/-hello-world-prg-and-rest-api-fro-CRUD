//controller is used to bifurgate logical portion of application from router files.
//in controllers only logical part is mentioned
const express = require('express')

const mongoose = require('mongoose')
//import model here
const BlogModel = mongoose.model('Blog')

//add libraries as follow:
const response = require('./../libs/responseLib')
const time = require('./../libs/timeLib')
const check = require('./../libs/checkLib')
const logger=require('./../libs/loggerLib')
/*here we use shortt id for blog's uniqe id...(here question arise in mind that 
mongodb by defult create unique object id for particular blog,
then why there is need of shortid for blog?..
ans is that object id is too big in length,so we use short id,npm packet...
computer will automatically create a short random unique id for a blog  by use of shortid packet.)*/

//generate short id via cmd ... npm install shortid --save
const shortid = require('shortid')

/*//route parameter function
let testRoute=(req,res)=>{

 console.log(req.params);
 res.send(req.params);

}//end route parameter functtion


//query parameter function
let testQuey=(req,res)=>{

    console.log(req.query)
    res.send(req.query)
}
// end query parameter function

//body parameter function
let testBody=(req,res)=>{
    console.log(req.body);
    res.send(req.body);
}
//end body parameter function*/
//---------------------------------------------------------------------------------------------

//API for getting all blogs
let getAllBlog = (req, res) => {
    BlogModel.find()//find is method in mongoose to find something
        .select('-__v -_id')//anything which u want to hide from the user,write it like this
        //(its an object id,which is by default created by mongoDb...)
        .lean()//converts mongoose object into javascript object
        .exec((err, result) => {
            if (err) {

                //console.log(err);
                logger.error(err.message,"Blog Controller:get All Blog",10)
                let apiResponse = response.generate(true, 'Failed to find Blog Details', 500, null)
                res.send(apiResponse);

            } else if (check.isEmpty(result)) {

                //console.log('No Blog Found');
                logger.info("No Blog Found","Blog Controller:get All Blog",8)
                let apiResponse = response.generate(true, 'No Blog Found', 404, null)
                res.send(apiResponse);

            } else {
                logger.info("Blog Found SuccessFully","Blog Controller:get All Blog",5)
                let apiResponse = response.generate(false, 'All Blog Details found', 200, result)
                res.send(apiResponse)
            }

        })

}//end of get all blog

//API for getting a single blog
let viewByBlogId = (req, res) => {

    if (check.isEmpty(req.params.blogId)) {

        console.log('blogId should be passed');
        let apiResponse = response.generate(true, 'blogId is missing', 403, null)
        res.send(apiResponse)
    } else {

        BlogModel.findOne({ 'blogId': req.params.blogId }, (err, result) => {
            if (err) {

                //console.log(err)
                logger.error(`Error Occured: ${err}`,'Database',10)
                let apiResponse = response.generate(true, 'Error occured', 500, null)
                res.send(apiResponse)

            } else if (check.isEmpty(result)) {

                //console.log('Blog not Found');
                logger.info('Blog not Found',"blogController:view by BlogId",8)
                let apiResponse = response.generate(true, 'Blog Not Found', 404, null)
                res.send(apiResponse);

            } else {
                logger.info('Blog Found Successfully',"blogController:view by BlogId",5)
                let apiResponse = response.generate(false, 'Blog Found Successfully', 200, result)
                res.send(apiResponse)
            }

        })
    }
}//end of viewByBlogId function

//API for view blog By Author
let viewByAuthor = (req, res) => {

    if (check.isEmpty(req.params.author)) {

        console.log("author should be passed")
        let apiResponse = response.generate(true, "author is misssing", 403, null)
        res.send(apiResponse)

    } else {

        BlogModel.findOne({ 'author': req.params.author }, (err, result) => {
            if (err) {

                //console.log(err)
                logger.error(`Error Occured: ${err}`,'Database',10)
                let apiResponse = response.generate(true, 'Error Occured', 500, null)
                res.send(apiResponse)

            } else if (check.isEmpty(result)) {

               // console.log('Blogs Not Found');
               logger.info('Blog not Found',"blogController : view by Author",8)
                let apiResponse = response.generate(true, 'Blogs Not Found', 404, null)
                res.send(apiResponse);

            } else {

                logger.info('Blog Found Successfully',"blogController : view by Author",5)
                let apiResponse = response.generate(false, 'Blogs found successfully', 200, result)
                res.send(apiResponse);

            }
        })
    }//end of else
}//end of blog by author function

//API for view blog By category
let viewByCategory = (req, res) => {

    if (check.isEmpty(req.params.categoryId)) {

        console.log("categoryId should be passed")
        let apiResponse = response.generate(true, "categoryId is missing", 403, null)
        res.send(apiResponse)
    } else {

        BlogModel.findOne({ 'category': req.params.category }, (err, result) => {

            if (err) {

               // console.log(err)
                logger.error(`Error Occured: ${err}`,'Database',10)
                let apiResponse = response.generate(true, 'Error Occured', 500, null)
                res.send(apiResponse)

            } else if (check.isEmpty(result)) {

               // console.log('Blogs Not Found');
                logger.info('Blogs Not Found','blogController: view By category',8)
                let apiResponse = response.generate(true, 'Blogs Not Found', 404, null)
                res.send(apiResponse);

            } else {
                
                logger.info('Blogs found successfully','blogController: view By category',5)
                let apiResponse = response.generate(false, 'Blogs found successfully', 200, result)
                res.send(apiResponse)
            }
        })
    }
}//end of blog by category function

//API for create blog function
let createBlog = (req, res) => {

    //let today=Date.now()
    let today = time.getLocalTime()
    console.log('TIME: ' + today)
    let blogId = shortid.generate()
    //create instance of the blogmodel
    let newBlog = new BlogModel({
        blogId: blogId,
        title: req.body.title,
        description: req.body.description,
        bodyHtml: req.body.blogBody,
        isPublished: true,
        category: req.body.category,
        author: req.body.fullName,
        created: today,
        lastModified: today
    })

    let tags = (req.body.tags != undefined && req.body.tags != null && req.body.tags != '') ? req.body.tags.split(',') : []

    newBlog.tags = tags
    newBlog.save((err, result) => {
        if (err) {

            //console.log(err)
            logger.error(`Error Occured: ${err}`,"Database",10)
            let apiResponse = response.generate(true, "Error Occured", 500, null)
            res.send(apiResponse)

        } else {

            logger.info("Blog Created Successfully","blogController : create Blog",5)
            let apiResponse = response.generate(false, "Blog Created successfully", 200, result)
            res.send(apiResponse)
        }

    })
}//end of create blog function

//API for editing blog
let editBlog = (req, res) => {

    if (check.isEmpty(req.params.blogId)) {

        console.log('blogId should be passed')
        let apiResponse = response.generate(true, 'blogId is missing', 403, null)
        res.send(apiResponse)
    } else {

        let options = req.body
        console.log(options)

        BlogModel.update({ 'blogId': req.params.blogId }, options, { multi: true })
            .exec((err, result) => {
                if (err) {

                    // console.log(err)
                    logger.error(`Error Occured: ${err}`,'Database',10)
                    let apiResponse = response.generate(true, "Error Occured", 500, null)
                    res.send(apiResponse)

                } else if (check.isEmpty(result)) {

                   // console.log('Blog Not Found')
                    logger.info('Blog Not Found',"blogController : edit Blog",8)
                    let apiResponse = response.generate(true, "Blog Not Found", 404, null)
                    res.send(apiResponse)

                } else {

                    logger.info('Blog Edited successfully',"blogController : edit Blog",5)
                    let apiResponse = response.generate(false, "Blog Edited successfully", 200, result)
                    res.send(apiResponse)

                }
            })
    }
}//end of editBlog function


//API for delete blog

let deleteBlog = (req, res) => {

    if(check.isEmpty(req.params.blogId)){

        console.log("blogId should be passed")
        let apiResponse=apiResponse.generate(true,"blogId is missing",403,null)
        res.send(apiResponse)

    }else{
    BlogModel.remove({ 'blogId': req.params.blogId }, (err, result) => {
        if (err) {

           // console.log(err)
            logger.error(`Error Occured: ${err}`,'Database',10) 
            let apiResponse = response.generate(true, "Error Occured", 500, null)
            res.send(apiResponse)

        } else if(check.isEmpty(result)) {

            //console.log('Blog Not Found')
            logger.info('Blog Not Found',"blogController : delete Blog",8)
            let apiResponse = response.generate(true, "Blog Not Found", 404, null)
            res.send(apiResponse)

        } else {

            logger.info('Blog Deleted successfully',"blogController : delete Blog",5)
            let apiResponse = response.generate(false, "Blog Deleted successfully", 200, result)
            res.send(apiResponse)

        }
    })
}
}//end of delete blog function

let increaseBlogView = (req, res) => {

    if (check.isEmpty(req.params.blogId)) {
    
        console.log('blogId should be passed')
        let apiResponse = response.generate(true, 'blogId is missing', 403, null)
        res.send(apiResponse)
    } else {

    BlogModel.findOne({ 'blogId': req.params.blogId }, (err, result) => {

        if (err) {

            //console.log(err)
            logger.error(`Error Occured : ${err}`, 'Database', 10)
            let apiResponse = response.generate(true, "Error Occured", 500, null)
            res.send(apiResponse)

        } else if (check.isEmpty(result)) {

            //console.log('Blog Not Found')
            logger.info('Blog Not Found', 'blog Controller:increase blog view count', 8)
            let apiResponse = response.generate(true, "Blog Not Found", 404, null)
            res.send(apiResponse)

        } else {

            result.views += 1;
            result.save(function (err, result) {

                if (err) {

                    //console.log(err)
                    logger.error(`Error Occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, "Error Occured while saving Blog", 500, null)
                    res.send(apiResponse)

                }
                else {

                    //console.log("Blog view updated successfully")
                    logger.info('Blog view increased successfully', 'blog Controller : increase blog view count', 5)
                    let apiResponse = response.generate(false, "Blog view increased successfully", 200, result)
                    res.send(apiResponse)

                }
            });// end result

        }
    })
}
}//end of increaseblogview function

//-------------------------------------------------------------------------------------------------------

module.exports = {

    /* testRoute:testRoute,
     testQuey:testQuey,
     testBody:testBody,*/

    getAllBlog: getAllBlog,
    viewByBlogId: viewByBlogId,
    viewByAuthor: viewByAuthor,
    viewByCategory: viewByCategory,
    deleteBlog: deleteBlog,
    editBlog: editBlog,
    createBlog: createBlog,
    increaseBlogView: increaseBlogView

}
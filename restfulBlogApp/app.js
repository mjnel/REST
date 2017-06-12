var express = require ("express");
var app = express(); 
var bodyParser = require ("body-parser");
var mongoose = require ("mongoose"); 
var moment = require('moment');
var methodOverride = require ("method-override");
// doesn't allow any html script tags to be written into the code
var     expressSanitizer = require("express-sanitizer");
    
//APP CONFIG
mongoose.connect ("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs"); 
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
//method-override - tells app.js to take whatever the method is equal to and treat it as the request type (PUT/DELETE)




//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
    // auto specifying the date which the object is insantiated 
    
})

var Blog = mongoose.model("Blog", blogSchema);

//RESTFUL ROUTES

app.get("/", function(req,res){
    
    res.redirect("/blogs");
})

//INDEX ROUTE 
    app.get("/blogs", function(req, res){
        Blog.find({}, function(err, allBlogs){
        if(err){
            console.log("there is an error here")
            console.log(err)
        }else{
            console.log("NO ERROR")
            res.render("index", {blogs: allBlogs} )
        
        }    

        })  
        })
        // Route to go to the blogs DB, get all the blogs, pass into a variable called allBlogs and map this to "blogs" to pass to index.ejs

//NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
    
})

//CREATE ROUTE

app.post("/blogs", function (req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    console.log(req.body);
    var newBlog = req.body.blog
 Blog.create (newBlog, function (err, newBlog){
     if(err){
         console.log(err)
         res.render("new")
     }else{
         console.log(newBlog)
         res.redirect("/blogs")
     }
     
 })
    
    
})


//Test Route

    app.get("/test",function(req, res){
    
        var date = "Sat Apr 01 2017 10:25:05 GMT+0100 (GMT Daylight Time)"
        var result =moment (date).format("dddd") 

        console.log(result);


    
})




//SHOW route
app.get("/blogs/:id",function(req, res){
    var actualBlog = req.params.id;
    Blog.findById(actualBlog, function(err, foundBlog){
        var result = moment(foundBlog.created).format("MMMM DD YYYY");
         if(!err){
            res.render("show", {blog: foundBlog, date: result});
         }else {
             console.log(err);  
         }  
    })

    
})

// EDIT ROUTE 
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
                  if(err){
                      res.redirect("/blogs");
                  }else{
                      console.log(foundBlog);
                    res.render("edit", {blog: foundBlog})            
                                   }
                  
                  })       
})



//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(!err){
            console.log("updated");
            res.redirect("/blogs/"+req.params.id);
        }else{
            console.log(err);
        }
    })
    
    //take ID of the blog
    //update it with the new data. 
})


//DELETE
app.delete("/blogs/:id", function(req, res){
Blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
        res.redirect("/blogs"); 
    }else{
        res.redirect("/blogs");
    }
})
//destory blog
//
});



app.listen(3000, function () {
  console.log('up on localhost:3000')
})





// Blog.create({
//     title:"Test Blog",
//     image: "http://imaging.nikon.com/lineup/lens/zoom/normalzoom/af-s_dx_18-140mmf_35-56g_ed_vr/img/sample/sample1_l.jpg",
//     body: "This is the lorem ipsum test blog"
// },function(err, actual){
//     console.log(actual);
// });

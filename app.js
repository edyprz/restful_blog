var bodyparser = require("body-parser"),
methodoverride = require("method-override"),
expresssanitizer= require("express-sanitizer"),
      mongoose = require("mongoose"),
	   express = require("express"),
	       app = express();

mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/restful_blog_app',{useNewUrlParser: true });
app.set("view engine","ejs");//para poder visualizar files.ejs
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));//s
app.use(expresssanitizer());
app.use(methodoverride("_method"));

//mongoose model config
var blogschema = mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog",blogschema);

/*Blog.create({
	title: "test blog",
	image: "https://images.unsplash.com/photo-1564409750752-4141f8b72cf8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
	body: "hello this is a blog post!"
});*/

//restful routes
app.get("/", function(req, res){
	res.redirect("/blogs");
});
//index route
app.get("/blogs", function(req,res){
	Blog.find({}, function(err,blogs){
		if(err){
			console.log("ERROR!");
		}else{
			res.render("index",{blogs:blogs});			
		}
	});
});
//new route
app.get("/blogs/new", function(req,res){
	res.render("new");	
});
//create route
app.post("/blogs", function(req,res){
	//create blog
	Blog.create(req.body.blog, function(err, newblog){
		if(err){
			res.render("new");		   
		}else{
			res.redirect("/blogs");	   
		}
	});
});
//show route
app.get("/blogs/:id", function(req,res){
	Blog.findById(req.params.id, function(err, foundblog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show",{blog:foundblog});
		}
	});
});
//edit route
app.get("/blogs/:id/edit", function(req,res){
	Blog.findById(req.params.id, function(err,foundblog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("edit",{blog: foundblog});
		}
	});
});
//update route
app.put("/blogs/:id", function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body);//evita el uso de scripts
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedblog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
});
//delete route
app.delete("/blogs/:id", function(req,res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");		   
		   }else{
			   res.redirect("/blogs");
		   }
	});
});


app.listen(3000, function(){
	console.log("server is running");
});
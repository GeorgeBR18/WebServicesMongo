const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { request } = require("http");
const { response } = require("express");
const { Console } = require("console");
const { strict } = require("assert");
const port = 3000;

//ejs configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views' ));
//app.use(express.static(path.join(__dirname , 'views' )));

//body-parser configuration
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static('public'));


//coneccion db
mongoose.connect(
  "mongodb+srv://root:rootroot@soloprueba.mlvp6.mongodb.net/Profiles?retryWrites=true&w=majority",
  { useUnifiedTopology: true }); 

mongoose.connection.on("error", function (error) {
  console.log("error con la conexion con mongodb");
});
mongoose.connection.once("open", function () {
  console.log("Success: conexion con mongodb");
});

//description DB
let customSchemma = new mongoose.Schema({
    userName : String,
    date : String,
    promotion : String,
    phone : String,
    time : String
});

//model
let customModel = mongoose.model('user', customSchemma);

//routes
app.get('/client', (request,response)=>{
    response.render('client.ejs');
});

//Save description
app.post('/submit',(request, response)=>{
    let varname = request.body.userName;
    let vardate = request.body.userDate;
    let varprom = request.body.userProm;
    let varphone = request.body.userPhone;
    let vartime = request.body.userTime;

    //prueba
    //console.log(varname);
    //console.log(vardate);
    //console.log(varprom);

    //save information
    let newDoc = new customModel({
        userName : varname,
        date : vardate,
        promotion : varprom,
        phone : varphone,
        time : vartime
    });

    newDoc.save(function(err, document){
        if(err){
            console.log('Error:data dont saved');
            response.send('Error: Problem, the data wasnt saved sorry');
        }else{
            console.log('Success: Data saved');
            response.send('Success: Greats, the data was saved on MongoDB');
        }
    });
});

//list of clients
app.get('/allitems', (request, response) =>{
    customModel.find({}, function(err, documents){
        if(err){
            console.log('Error: I cant take the data');
            response.render('allitems.ejs', {
                error: 'Error: I cant take the data'
            });
        }else{
            console.log('Success: I have the data');
            response.render('allitems.ejs', {
                results: documents
            });
        }
    });
});

//search clients
app.get('/search', (request, response)=>{
    response.render('search.ejs')
});
app.post('/filter', (request, response)=>{
    let varprom = request.body.userProm;
    //filter DB
    customModel.find({promotion : varprom}, function(err, documents){
        if(err){
            console.log(err);
            response.render('filter.ejs',{
                error : 'Error: I couldnt find them'
            });
        }else{
            console.log('Success: I could find them');
            response.render('filter.ejs',{
                results : documents, 
                promotion : varprom
            });
        }
    }); 
});

//update data
app.get('/update', (request, response)=>{
    response.render('update.ejs');
});
app.post('/update', (request, response)=>{
    let varname = request.body.userName;
    let newDate = request.body.userdate;
    
    //update information
    customModel.updateOne({
        userName : varname    
    },{
        date : newDate
    },function(err, result){
        if(err){
            console.log(err);
            response.render('result.ejs',{
                error : 'could not update'
            })
        }
        if(err === null){
            console.log('Success: the update is correct');
            response.render('result.ejs',{
                error : 'could update the data'
            })
        }
    });
});

//delete data
app.get('/delete', (request, response)=>{
    response.render('delete.ejs');
});
app.post('/delete', (request, response)=>{
    let varusername = request.body.userName;
    let varprom = request.body.userProm;

    //delete doc
    customModel.deleteOne({
        userName : varusername,
        promotion : varprom
    }, function(err){
        if(err){
            console.log(err);
            response.render('deleteresult.ejs',{
                error : 'the document could not be deleted'
            });
        }else{
            console.log('Success: the document could be deleted');
            response.render('Deleteresult.ejs',{
                error : 'the document could be deleted'
            });
        }
    });
});

app.listen(port, () => {
  console.log("Listening at localhost:"+ port);
});

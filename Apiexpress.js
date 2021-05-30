const express = require('express');
const app = express();
const mongoose = require('mongoose');
const AuthRoute = require('./Auth')
mongoose.connect("mongodb+srv://Crudattempt1:Crudattempt1@crudapi.0dmke.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true})
.then( () => console.log("") )
.catch((err) => console.log(err));

 const struc = new mongoose.Schema({
    dweet: String,
    posted_by: String,
    posted_at:{
        type:Date,
        default: Date.now
    } ,
    last_updated_at:{
        type: Date,
        default: Date.now
    },
 }
 )

const Data = new mongoose.model("Data", struc);

const userSchema = new mongoose.Schema({
    Posted_by:{type: String , required:true, unique:true},
}, {timestamps: true})

const User = new mongoose.model("User", userSchema) 

app.post('/dweet/user/:posted_by' , (req,res) => {
    var username = req.params.posted_by;
    const u1 = new User({
        Posted_by: username
    })
    u1.save(function(err) {
        if (err) {
          if (err.name === 'MongoError' && err.code === 11000) {
            // Duplicate username
            return res.status(500).send({ success: false, message: 'User already exists!' });
          }
    
          // Some other error
          return res.status(500).send(err);
    }
        else {
            res.send("Thanks for giving the  username. It has been saved as "+ u1.Posted_by);
        }
    })
    

      
    //createuser();
    const resultofpostedby = req.params.posted_by;
    var postedlength = resultofpostedby.length;
    if(postedlength > 50 ||  postedlength < 6){
        res.send("The user name is not valid. The length should be between 6 and 50 characters")
    }
})

var port = 3000;
 app.get('/', (req,res) => {
 res.send("CRUD API")
//  app.use('/api', AuthRoute)
 })

 app.get('/dweet/create/:dweetid' , (req,res) => {
 var createdweet = req.params.dweetid;
 var length = createdweet.length;


 if(length<141){
    const d1 = new Data({
        dweet: createdweet
    })
    const createDocument = async () => {
     const result = await d1.save(); 
     res.send("Thanks for giving the dweet! It has been saved! It's ID is "+ result._id);
    }; 
    createDocument();

    // update dweet
     app.get('/dweet/:updatedweetids/update/:newdweet' , (req,res) =>  {
         var updateids = req.params.updatedweetids;
         var newdweetchange = req.params.newdweet;
        const updateDocument = async (_id) =>{
            var result10 = await Data.findById( {_id: updateids} )
            result10.dweet = newdweetchange
            res.send("The new dweet is "+ result10.dweet)
            result10.save();
        }
        const updatetime = async (_id) =>{
            var result11 = await Data.findById( {_id: updateids} )
            result11.last_updated_at = Date.now()
            result11.save();
        }
        updateDocument(); 
        updatetime(); 
        });
         

     

    app.get('/dweet/:Searchid' , (req, res) => {
        var searchids = req.params.Searchid;
        
        Data.findById(searchids).then(doc => {
            res.send("Your dweet is - "+ doc.dweet);
        })
    }); 
    

    app.get('/dweet/:did/delete', (req,res) =>{
        var deleteid = req.params.did;
        const deleteDocument = async (_id) =>{
            const result = await Data.deleteOne( {_id: deleteid} );
        }
        deleteDocument(deleteid);
        res.send("Your dweet has been deleted")
    })
 }
 

    

 else{
     res.send(" Error : This is not a dweet. Use less characters");
 }
 })


app.listen(port, () => {
     console.log("Server listening on port " + port);
    })
 


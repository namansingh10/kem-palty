const express = require("express");
const path = require("path");
const app = express();
var mongoose  = require('mongoose');
mongoose.connect('mongodb://localhost/date',
{
    useNewUrlParser: true  
}).then(() =>{
    console.log(`coneection successful`);
}).catch((e) =>{
    console.log(`no connection`);
})
const port = 80;

//DEFINE MONGOOSE SCHEMA
var signupSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    password: String,
    confirm: String,
});
var signup = mongoose.model('signup', signupSchema);
app.use('/static', express.static('static'))
app.use(express.urlencoded())
app.set('view engine', 'pug')
app.set('views', path.join(__dirname,'views'))
app.get('/', (req, res)=>{
    res.status(200).render('login.pug');
})

app.post('/login', async (req, res)=>{
    try {
        var email = req.body.email;
        var password = req.body.password;
       var useremail = await signup.findOne({email:email});
        if(useremail.password == password){
           res.status(201).render("home");
       }
       
       else{
        res.status(201).send("Passwords are not matching!!!");
       }

        
    } catch (error) {
        res.status(400).render("signup")
    }
}) 

app.get('/home', (req, res)=>{
    res.status(200).render('home.pug');
})
app.get('/signup', (req, res)=>{
    res.status(200).render('signup.pug');
})
app.post('/signup', (req, res)=>{
    var myData = new signup(req.body);
    myData.save().then(()=>{
        
        res.status(201).render("preference");
       
    }).catch(()=>{
    res.status(400).send("item was not saved to the databse")
});
    
}) 
app.listen(port, ()=>{
    console.log(`The application started successfully on port ${port}`);
});
/**/

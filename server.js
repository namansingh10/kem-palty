const express = require("express");
const path = require("path");
const session = require('express-session');
const multer = require('multer');
const app = express();
var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.locals.basedir = path.join(__dirname, 'views');

// Multer configurations

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname)
    }
});

const upload = multer({ storage: storage });

const storagenew = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/uploads/post/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname)
    }
});

const uploadmedia = multer({ storage: storagenew });

// Mangoose atlas configurations

var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://saurabh:Pass_123@cluster0.bbw9b.mongodb.net/date?retryWrites=true&w=majority',
    {
        useNewUrlParser: true
    }).then(() => {
        console.log(`connection successful`);
    }).catch((e) => {
        console.log(`no connection`);
    })
const port = 800;

// Mongoose user schema

var signupSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    gender: String,
    bio: String,
    password: String,
    pref: Array,
    profile: String,
});

module.exports = mongoose.model('User', signupSchema);
var User = mongoose.model('users', signupSchema);
// mongoose post schema

var postSchema = new mongoose.Schema({
    media: String,
    caption: String,
    likes: Number,
    comments: Array,
    user: String,
    date: String,
})

var Post = mongoose.model('post', postSchema);



// Static configurations

app.use('/static', express.static('static'))
app.use(express.urlencoded())
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))


app.get('/', (req, res) => {
    res.render('home.pug', {title:"Home"})
})

app.get('/login', (req, res) => {
    res.render('login.pug')
})
app.post('/login', async (req, res) => {
        var email = req.body.email;
        var password = req.body.password;
        console.log(email, password);
        User.findOne({ email: email }).then((user) => {
        if (user) {
            if (user.password == password) {
                res.cookie('user', user);
                res.redirect('/home');
            } else {
                res.redirect('/login');
            }
        } else {
            res.redirect('/login');
        }
    })
})


app.get('/home', (req, res) => {
    email = req.cookies.user.email;
    // check if email exist
    if (email == null) {
        res.status(400).send("Please login first")
    }
    else {
        User.findOne({ email: email }).then((result) => {
            res.render('home.pug', {
                user: result,
                title: "home"
        })
    })
    }
})


app.get('/signup', (req, res) => {
    res.status(200).render('signup.pug');
})

// Signup endpoint for registering new users

app.post('/signup', (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var gender = req.body.gender;
    var password = req.body.password;
    var c_password = req.body.confirm;
    pref = [];


    var temp = true
    // check if user already exist
    User.findOne({ email: email }).then(function (result) {
        if (result != null) {
            temp = false;
            const error = {
                "code": "400",
                "message": "Email already exist"
            }
            var errorn = JSON.stringify(error)
            res.status(400).send(errorn)
        }
    });
    // validate each parameter
    if (name == null || name == "" || email == null || email == "" || phone == null || phone == "" || gender == null || gender == "" || password != c_password) {
        temp = false
        console.log("name is null")
    }

    if (temp == false) {
        const error = {
            "code": "400",
            "message": "Something went unexpected"
        }
        var errorn = JSON.stringify(error)
        res.status(400).send(errorn)
    }
    else {
        var user = new User({
            name: name,
            email: email,
            phone: phone,
            gender: gender,
            password: password,
            pref: pref
        })
        user.save().then(() => {
                error = {
                    "code": "200",
                    "message": "succesfully signed up"
                }
                var errorn = JSON.stringify(error)
                // set email in session
                req.session.email = email;
                res.status(200).send(errorn)
            })

    }
    //     var myData = new User(req.body);

    //     myData.save().then(()=>{

    //         res.status(201).render("preference");

    //     }).catch(()=>{
    //     res.status(400).send("item was not saved to the databse")
    // });

})

app.get('/pref', (req, res) => {
    email = req.cookies.user.email;
    // check if id exist
    if (email == null) {
        res.status(400).send("Please login first")
    }
    else {
        User.findOne({ email: email }).then((result) => {
            res.status(200).render('pref.pug')
        })
    }
})


app.post('/pref', (req, res) => {
    var myData = new pref(req.body);
    myData.save().then(() => {

        res.status(400).send("item was saved to the databse")
    }).catch(() => {
        res.status(400).send("item was not saved to the databse")
    })
});

app.get('/user', (req, res) => {

    email = req.cookies.user.email;
    // check if email exist
    if (email == null) {
        res.status(400).send("Please login first")
    }
    else {
        // find all the post where user = email in array
        Post.find({ user: email }).then((result) => {
            post = result
        })

        user = User.findOne({ email: email }).then((result) => {
            res.status(200).render('user.pug', {
                email: email,
                name: result.name,
                pref: result.pref,
                bio: result.bio,
                profile: result.profile,
                phone: result.phone,
                post: post
            })
        })
    }
})


// Update details endpoint for user

app.post('/user/updatedetails', (req, res) => {
    email = req.cookies.user.email;
    var name = req.body.name;
    var phone = req.body.phone;
    var bio = req.body.bio;

    User.findOneAndUpdate({ email: email }, { $set: { name: name, phone: phone, bio: bio } }, { new: true }).then((result) => {
        res.redirect('/user')
    })
});

// Change Dp image

app.post('/user/dpchange', upload.single('dp'), (req, res) => {
    console.log(req.file),
    email = req.cookies.user.email;
    // selectone from user
    User.findOne({ email: email }).then((result) => {
        // update the dp
        User.updateOne({ email: email }, { $set: { profile: req.file.path } }).then(() => {
            res.redirect('/user')
        })
    })
        .catch(() => {
            res.status(400).send("item was not saved to the databse")
        })
})

// Post Image with caption

app.post('/user/uploadmedia', uploadmedia.single('media'), (req, res) => {
    console.log(req.file),
    email = req.cookies.user.email;
    caption = req.body.caption;
    // create new post
    var post = new Post({
        media: req.file.path,
        caption: caption,
        likes: 0,
        comments: [],
        user: email,
        date: new Date(),
    })
    post.save().then(() => {
        res.status(200).json({
            "code": "200",
            "message": "succesfully uploaded"
        })
    }).catch(() => {
        res.status(400).json({
            "code": "400",
            "message": "something went wrong"
        })
    })
})

// Delete a post

app.get('/delete_post/:post_id', (req, res) => {
    email = req.cookies.user.email;
    var post_id = req.params.post_id;
    Post.find({ _id: post_id }).then((result) => {
        if (result[0].user == email) {
    Post.findByIdAndDelete(post_id).then(() => {
        // delete the file in result[0].media
        res.json('post deleted')
    })
        }
        else{
            res.json('unauthorized')
        }   
})
})

// Like a post

app.get('/user/like/:id', (req, res) => {
    Post.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }).then(() => {
        res.json("Updated")
    }).catch(() => {
        res.status(400).send("item was not saved to the databse")
    })
})

// Get Profile Detail

app.get('/get_profile_detail/:profile_id', (req, res) => {
    // find user where _id = profile_id
    User.findOne({ _id: req.params.profile_id }).then((result) => {
        res.json(result)
    }).catch(() => {
        res.status(400).send("invalid profile id")
    })
})

// Get all posts of user

app.get('/get_posts/:user_id', (req, res) => {
    User.findOne({ _id: req.params.user_id }).then((result) => {
        email = result.email

        // find all post where user = email
        Post.find({ user: email }).then((result) => {
            res.json(result)
        }).catch(() => {
            res.status(400).send("invalid user id")
        })
    })
})

// Get Post detail

app.get('/get_post_detail/:post_id', (req, res) => {
    // find user where _id = profile_id
    Post.findOne({ _id: req.params.post_id }).then((result) => {
        res.json(result)
    }).catch(() => {
        res.status(400).send("invalid post id")
    })
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}


app.listen(port, () => {
    console.log(`The application started successfully on port ${port}`);
});

// const express = require('express');
// const app = express();
// const http = require('http').createServer(app);

// const PORT = process.env.PORT || 3000

// http.listen(PORT, () => {
//     console.log(`Listening on port ${PORT}`);
// })

// app.use(express.static(__dirname + '/public'));

// app.get('/', (req,res)=>{
//     res.sendFile(__dirname + '/index.html');
// })

// //socket

// const io = require('socket.io')(http);

// io.on('connection', (socket) => {
//     console.log('Connected...');
//     socket.on('message', (msg) => {
//         socket.broadcast.emit('message', msg);
//     })

// })
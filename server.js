const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const app = express()
const httpServer = http.createServer(app);
const io = new Server(httpServer)
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const routes = require('./routes')
const Users = require('./models')

app.use(express.static('public'))
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('./public'))

//arreglo donde se guardan los mensajes del chat//
const chats = []
//arreglo donde se guardan los productos//
const messages = [
    {
      title: "Campera Gore Tex",
      thumbnail: "https://pavlopkin.github.io/Art-Vandelay/assets/gore.png",
      price:25000,
    },
    {
      title: "Puffy Shirt",
      thumbnail: "https://pavlopkin.github.io/Art-Vandelay/assets/puffy.png",
      price: 60000,
    },
    {
      title: "Bolígrafo anti gravedad",
      thumbnail: "https://pavlopkin.github.io/Art-Vandelay/assets/boligrafo.png",
      price: 1500,
    },
    {
      title: "Jimmy's Shoes",
      thumbnail: "https://pavlopkin.github.io/Art-Vandelay/assets/shoes.png",
      price: 13000,
    },
    {
      title: "Fusilli Jerry",
      thumbnail: "https://pavlopkin.github.io/Art-Vandelay/assets/fusilli.png",
      price: 1200,
    },
    {
      title: "The coffee table booky",
      thumbnail: "https://pavlopkin.github.io/Art-Vandelay/assets/bookof.png",
      price: 3500,
    },
];

io.on('connection', (socket) => {
  console.log('user conetado, id: ' +  socket.id)

  socket.emit('messages', messages); 

  socket.on('new-message', (newMessage) => {
      console.log({newMessage});
      messages.push(newMessage);
      io.sockets.emit('messages', messages)
      const pos = messages.length - 1;
      })

  socket.emit('chats', chats);

  socket.on('new-chat', (newChats) => {  
      console.log({newChats});
      chats.push(newChats);
      io.sockets.emit('chats', chats)
  })
});

passport.use('login', new LocalStrategy(
    (username, password, done) => {
        Users.findOne({username}, (err, user) => {
            if(err) return done(err)
            if (!user) console.log('no se encontro el usuario ')
            return done(null, user)
        })
    }
))

passport.use('signup', new LocalStrategy(
    { passReqToCallback: true },
    (req, username, password, done) => {
        console.log('signup...')

        Users.findOne({username}, (err, user) => {
            if(err) return done(err)
            if (user) {
                console.log('User already exists')
                return done(null, false)
            }

            const newUser = { username, password, name: req.body.name }
            Users.create(newUser, (err, userWithID) => {
                if(err) return done(err)

                console.log(userWithID)
                return done(null, userWithID)
            })

        })

    }
))

passport.serializeUser((user, done) => {
    done(null, user._id)
})
passport.deserializeUser((id, done) => {
    Users.findById(id, done)
})
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 600000,
        secure: false,
        httpOnly: true
    }
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', routes.getRoot)

app.get('/login', routes.getLogin)
app.post(
    '/login',
    passport.authenticate('login'),
    routes.postLogin
)
app.get('/signup', routes.getSignup)
app.post(
    '/signup',
    passport.authenticate('signup', {failureRedirect: '/failsignup'}),
    routes.postSignup
)
app.get('/failsignup', routes.getFailsignup)
app.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});
function checkAuthentication(req, res, next) {
    if(req.isAuthenticated()) next()
    else res.redirect('/login')
}
app.get('/private', checkAuthentication, (req, res) => {
    const { user } = req
    res.render('./index', { messages, user }) 
})


function connectDB(url, cb) {
    mongoose.connect(
        url,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        err => {
            if(!err) console.log('Connected DB!')
            if(cb != null) cb(err)
        }
    )
}

connectDB('mongodb://localhost:27017/registrados', err => {
    if(err) return console.log('Error connecting DB', err)

    app.listen(8080, () => {
        console.log('Listening...');
    })
})

